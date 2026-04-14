import basicVert from '@/shaders/ripples/basic.vert';
import dropFrag from '@/shaders/ripples/drop.frag';
import updateFrag from '@/shaders/ripples/update.frag';
import renderVert from '@/shaders/ripples/render.vert';
import renderFrag from '@/shaders/ripples/render.frag';

/**
 * @typedef {Object} RipplesOptions
 * @property {string|null} [imageUrl] - 背景圖片 URL
 * @property {number} [resolution=256] - 水波紋解析度 (建議: 256, 512, 1024)
 * @property {number} [dropRadius=20] - 水滴半徑 (像素)
 * @property {number} [perturbance=0.03] - 擾動強度 (建議: 0.01 ~ 0.1)
 * @property {boolean} [interactive=true] - 是否啟用滑鼠/觸控互動
 * @property {string} [crossOrigin=''] - 圖片 CORS 設定
 * @property {(() => HTMLElement | null) | null | undefined} [getElement] - 獲取目標元素的函式
 */
export interface RipplesOptions {
  imageUrl?: string | null;
  resolution?: number;
  dropRadius?: number;
  perturbance?: number;
  interactive?: boolean;
  crossOrigin?: string;
}

/**
 * @typedef {Object} RipplesConfigType
 * @property {number} type - WebGL 紋理類型
 * @property {Float32ArrayConstructor | Uint16ArrayConstructor | null} arrayType - 陣列類型建構函數
 * @property {boolean} linearSupport - 是否支援線性過濾
 * @property {string[]} extensions - 需要的 WebGL 擴展列表
 */
export interface RipplesConfigType {
  type: number;
  arrayType: Float32ArrayConstructor | Uint16ArrayConstructor | null;
  linearSupport: boolean;
  extensions: string[];
}

export interface WebGLProgramObj {
  id: WebGLProgram;
  uniforms: Record<string, Float32Array>;
  locations: Record<string, WebGLUniformLocation | null>;
}

export interface RipplesElement extends HTMLElement {
  ripples?: Ripples;
}

/**
 * WebGL 水波紋動畫效果類別
 *
 * 基於 WebGL 實現的互動式水波紋效果，可應用於任何 HTML 元素的背景。
 * 支援滑鼠/觸控互動、自動水滴、暫停/播放等功能。
 *
 * @example
 * // 基本用法 - 使用靜態方法初始化
 * Ripples.ripples('#myElement', {
 *   resolution: 512,
 *   dropRadius: 20,
 *   perturbance: 0.04,
 *   interactive: true,
 *   imageUrl: '/path/to/background.png'
 * });
 *
 * @example
 * // 程式化觸發水滴
 * const ripples = Ripples.ripples('#myElement', options);
 * ripples.drop(100, 200, 20, 0.04);
 *
 * @example
 * // 控制動畫狀態
 * Ripples.ripples('#myElement', 'pause');
 * Ripples.ripples('#myElement', 'play');
 * Ripples.ripples('#myElement', 'destroy');
 *
 * @class Ripples
 * @author Parker
 * @see https://github.com/archer102125220/javascript-ripples
 */
export class Ripples {
  /**
   * WebGL 渲染上下文 (共用)
   * @type {WebGLRenderingContext|null}
   * @static
   */
  static gl: WebGLRenderingContext | null = null;

  /**
   *  Load a configuration of GL settings which the browser supports.
   *  For example:
   *  - not all browsers support WebGL
   *  - not all browsers support floating point textures
   *  - not all browsers support linear filtering for floating point textures
   *  - not all browsers support rendering to floating point textures
   *  - some browsers *do* support rendering to half-floating point textures instead.
   */
  static loadConfig(): RipplesConfigType | null {
    if (typeof document !== 'object') {
      return null;
    }

    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (gl instanceof WebGLRenderingContext === false) {
      // Browser does not support WebGL.
      return null;
    }

    Ripples.gl = gl;

    // Load extensions
    const extensions: Record<string, unknown> = {};
    [
      'OES_texture_float',
      'OES_texture_half_float',
      'OES_texture_float_linear',
      'OES_texture_half_float_linear'
    ].forEach(function (name) {
      const extension = Ripples.gl?.getExtension(name);
      if (extension) {
        extensions[name] = extension;
      }
    });

    // If no floating point extensions are supported we can bail out early.
    if (!extensions.OES_texture_float) {
      return null;
    }

    const configs = [];

    function createConfig(
      type: string,
      glType: number,
      arrayType: Float32ArrayConstructor | Uint16ArrayConstructor | null
    ) {
      const name = 'OES_texture_' + type,
        nameLinear = name + '_linear',
        linearSupport = nameLinear in extensions,
        configExtensions = [name];
      if (linearSupport) {
        configExtensions.push(nameLinear);
      }

      return {
        type: glType,
        arrayType: arrayType,
        linearSupport: linearSupport,
        extensions: configExtensions
      };
    }

    configs.push(createConfig('float', Ripples.gl.FLOAT, Float32Array));

    if (extensions.OES_texture_half_float) {
      const halfFloatExt = (
        extensions.OES_texture_half_float as { HALF_FLOAT_OES: number }
      ).HALF_FLOAT_OES;
      configs.push(
        // Array type should be Uint16Array, but at least on iOS that breaks. In that case we
        // just initialize the textures with data=null, instead of data=new Uint16Array(...).
        // This makes initialization a tad slower, but it's still negligible.
        createConfig('half_float', halfFloatExt, null)
      );
    }

    // Setup the texture and framebuffer
    const texture = Ripples.gl.createTexture();
    const framebuffer = Ripples.gl.createFramebuffer();

    Ripples.gl.bindFramebuffer(Ripples.gl.FRAMEBUFFER, framebuffer);
    Ripples.gl.bindTexture(Ripples.gl.TEXTURE_2D, texture);
    Ripples.gl.texParameteri(
      Ripples.gl.TEXTURE_2D,
      Ripples.gl.TEXTURE_MIN_FILTER,
      Ripples.gl.NEAREST
    );
    Ripples.gl.texParameteri(
      Ripples.gl.TEXTURE_2D,
      Ripples.gl.TEXTURE_MAG_FILTER,
      Ripples.gl.NEAREST
    );
    Ripples.gl.texParameteri(
      Ripples.gl.TEXTURE_2D,
      Ripples.gl.TEXTURE_WRAP_S,
      Ripples.gl.CLAMP_TO_EDGE
    );
    Ripples.gl.texParameteri(
      Ripples.gl.TEXTURE_2D,
      Ripples.gl.TEXTURE_WRAP_T,
      Ripples.gl.CLAMP_TO_EDGE
    );

    // Check for each supported texture type if rendering to it is supported
    let config = null;

    for (let i = 0; i < configs.length; i++) {
      Ripples.gl.texImage2D(
        Ripples.gl.TEXTURE_2D,
        0,
        Ripples.gl.RGBA,
        32,
        32,
        0,
        Ripples.gl.RGBA,
        configs[i].type,
        null
      );

      Ripples.gl.framebufferTexture2D(
        Ripples.gl.FRAMEBUFFER,
        Ripples.gl.COLOR_ATTACHMENT0,
        Ripples.gl.TEXTURE_2D,
        texture,
        0
      );
      if (
        Ripples.gl.checkFramebufferStatus(Ripples.gl.FRAMEBUFFER) ===
        Ripples.gl.FRAMEBUFFER_COMPLETE
      ) {
        config = configs[i];
        break;
      }
    }

    return config;
  }

  /**
   * WebGL 配置 (瀏覽器支援檢測結果)
   * @type {Object|null}
   * @static
   */
  static config: RipplesConfigType | null = Ripples.loadConfig();

  /**
   * 預設配置選項
   * @type {RipplesOptions}
   * @static
   * @property {string|null} imageUrl - 背景圖片 URL
   * @property {number} resolution - 水波紋解析度 (預設: 256)
   * @property {number} dropRadius - 水滴半徑 (預設: 20)
   * @property {number} perturbance - 擾動強度 (預設: 0.03)
   * @property {boolean} interactive - 是否啟用滑鼠/觸控互動 (預設: true)
   * @property {string} crossOrigin - 圖片跨域設定
   */
  static DEFAULTS: Required<RipplesOptions> = {
    imageUrl: null,
    resolution: 256,
    dropRadius: 20,
    perturbance: 0.03,
    interactive: true,
    crossOrigin: ''
  };

  transparentPixels: ImageData;
  $el: RipplesElement;
  interactive: boolean;
  resolution: number;
  textureDelta: Float32Array;
  perturbance: number;
  dropRadius: number;
  crossOrigin: string;
  imageUrl: string | null;

  canvas: HTMLCanvasElement;
  context: WebGLRenderingContext;
  textures: WebGLTexture[];
  framebuffers: WebGLFramebuffer[];
  bufferWriteIndex: number;
  bufferReadIndex: number;
  quad: WebGLBuffer;

  visible: boolean;
  running: boolean;
  inited: boolean;
  destroyed: boolean;
  style: HTMLStyleElement;

  backgroundTexture: WebGLTexture | null = null;
  imageSource: string | null = null;
  backgroundWidth: number = 0;
  backgroundHeight: number = 0;
  originalInlineCss: string = '';
  originalCssBackgroundImage: string = '';

  dropProgram: WebGLProgramObj | null = null;
  updateProgram: WebGLProgramObj | null = null;
  renderProgram: WebGLProgramObj | null = null;

  private onMouseMove: ((e: MouseEvent) => void) | null = null;
  private onTouchMove: ((e: TouchEvent) => void) | null = null;
  private onTouchStart: ((e: TouchEvent) => void) | null = null;
  private onMouseDown: ((e: MouseEvent) => void) | null = null;
  private onWindowResize: (() => void) | null = null;

  /**
   * 建立 Ripples 實例
   *
   * @param {HTMLElement} el - 要套用水波紋效果的 HTML 元素
   * @param {RipplesOptions} options - 配置選項
   */
  constructor(el: HTMLElement, options: RipplesOptions) {
    this.transparentPixels = this.createImageData(32, 32);

    this.$el = el as RipplesElement;

    // Init properties from options
    this.interactive = options.interactive ?? Ripples.DEFAULTS.interactive;
    this.resolution = options.resolution ?? Ripples.DEFAULTS.resolution;
    this.textureDelta = new Float32Array([
      1 / this.resolution,
      1 / this.resolution
    ]);
    this.perturbance =
      options.perturbance !== undefined
        ? options.perturbance
        : Ripples.DEFAULTS.perturbance;
    this.dropRadius =
      options.dropRadius !== undefined
        ? options.dropRadius
        : Ripples.DEFAULTS.dropRadius;
    this.crossOrigin =
      options.crossOrigin !== undefined
        ? options.crossOrigin
        : Ripples.DEFAULTS.crossOrigin;
    this.imageUrl =
      options.imageUrl !== undefined
        ? options.imageUrl
        : Ripples.DEFAULTS.imageUrl;

    // Init WebGL canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.$el.clientWidth;
    canvas.height = this.$el.clientHeight;
    this.canvas = canvas;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.right = '0';
    this.canvas.style.bottom = '0';
    this.canvas.style.zIndex = '-1';

    this.$el.classList.add('javascript-ripples');
    this.$el.append(canvas);

    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl instanceof WebGLRenderingContext === false) {
      throw new Error('WebGL not supported');
    }

    this.context = gl;

    // Load extensions
    Ripples.config?.extensions.forEach((name) => {
      this.context?.getExtension(name);
    });

    // Auto-resize when window size changes.
    this.onWindowResize = this.updateSize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // Init rendertargets for ripple data.
    this.textures = [];
    this.framebuffers = [];
    this.bufferWriteIndex = 0;
    this.bufferReadIndex = 1;

    const arrayType = Ripples.config?.arrayType;
    const textureData = arrayType
      ? new arrayType(this.resolution * this.resolution * 4)
      : null;

    for (let i = 0; i < 2; i++) {
      const texture = this.context.createTexture() as WebGLTexture;
      const framebuffer = this.context.createFramebuffer() as WebGLFramebuffer;

      this.context.bindFramebuffer(this.context.FRAMEBUFFER, framebuffer);

      this.context.bindTexture(this.context.TEXTURE_2D, texture);
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_MIN_FILTER,
        Ripples.config?.linearSupport
          ? this.context.LINEAR
          : this.context.NEAREST
      );
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_MAG_FILTER,
        Ripples.config?.linearSupport
          ? this.context.LINEAR
          : this.context.NEAREST
      );
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_WRAP_S,
        this.context.CLAMP_TO_EDGE
      );
      this.context.texParameteri(
        this.context.TEXTURE_2D,
        this.context.TEXTURE_WRAP_T,
        this.context.CLAMP_TO_EDGE
      );
      this.context.texImage2D(
        this.context.TEXTURE_2D,
        0,
        this.context.RGBA,
        this.resolution,
        this.resolution,
        0,
        this.context.RGBA,
        Ripples.config?.type || this.context.FLOAT,
        textureData
      );

      this.context.framebufferTexture2D(
        this.context.FRAMEBUFFER,
        this.context.COLOR_ATTACHMENT0,
        this.context.TEXTURE_2D,
        texture,
        0
      );

      this.textures.push(texture);
      this.framebuffers.push(framebuffer);
    }

    // Init GL stuff
    this.quad = this.context.createBuffer() as WebGLBuffer;
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.quad);
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      new Float32Array([-1, -1, +1, -1, +1, +1, -1, +1]),
      this.context.STATIC_DRAW
    );

    this.initShaders();
    this.initTexture();
    this.setTransparentTexture();

    // Load the image either from the options or CSS rules
    this.loadImage();

    // Set correct clear color and blend mode (regular alpha blending)
    this.context.clearColor(0, 0, 0, 0);
    this.context.blendFunc(
      this.context.SRC_ALPHA,
      this.context.ONE_MINUS_SRC_ALPHA
    );

    // Plugin is successfully initialized!
    this.visible = true;
    this.running = true;
    this.inited = true;
    this.destroyed = false;

    this.setupPointerEvents();

    // Init animation
    const step = () => {
      if (!this.destroyed) {
        this.step();
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);

    // Extend the css
    this.style = document.createElement('style');
    this.style.innerText =
      '.javascript-ripples { position: relative; z-index: 0; }';
    document.querySelector('head')?.prepend(this.style);
  }

  /**
   * 檢查字串是否為百分比值
   * @param {string} str - 要檢查的字串
   * @returns {boolean} 是否為百分比
   * @private
   */
  private isPercentage(str: string): boolean {
    return str[str.length - 1] === '%';
  }

  private createImageData(width: number, height: number): ImageData {
    try {
      return new ImageData(width, height);
    } catch (e: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error(e);
      }
      // Fallback for IE
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx instanceof CanvasRenderingContext2D === false) {
        throw new Error('Cannot get 2d context');
      }
      return ctx.createImageData(width, height);
    }
  }

  private translateBackgroundPosition(value: string): string[] {
    const parts = value.split(' ');

    if (parts.length === 1) {
      switch (value) {
        case 'center':
          return ['50%', '50%'];
        case 'top':
          return ['50%', '0'];
        case 'bottom':
          return ['50%', '100%'];
        case 'left':
          return ['0', '50%'];
        case 'right':
          return ['100%', '50%'];
        default:
          return [value, '50%'];
      }
    } else {
      return parts.map(function (part) {
        switch (value) {
          case 'center':
            return '50%';
          case 'top':
          case 'left':
            return '0';
          case 'right':
          case 'bottom':
            return '100%';
          default:
            return part;
        }
      });
    }
  }

  private createProgram(
    vertexSource: string,
    fragmentSource: string
  ): WebGLProgramObj {
    const gl = this.context;

    function compileSource(type: number, source: string) {
      if (gl instanceof WebGLRenderingContext === false) {
        throw new Error('WebGL not supported');
      }
      const shader = gl.createShader(type);
      if (shader instanceof WebGLShader === false) {
        throw new Error('Could not create shader');
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    const program: WebGLProgramObj = {
      id: {} as WebGLProgram,
      uniforms: {},
      locations: {}
    };

    if (!gl) {
      throw new Error('WebGL not initialized');
    }
    const programId = gl.createProgram();
    if (!programId) throw new Error('Could not create program');
    program.id = programId;

    gl.attachShader(program.id, compileSource(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(
      program.id,
      compileSource(gl.FRAGMENT_SHADER, fragmentSource)
    );
    gl.linkProgram(program.id);
    if (!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
      throw new Error('link error: ' + gl.getProgramInfoLog(program.id));
    }

    // Fetch the uniform and attribute locations
    program.uniforms = {};
    program.locations = {};
    gl.useProgram(program.id);
    gl.enableVertexAttribArray(0);
    let match, name;
    const regex = /uniform (\w+) (\w+)/g,
      shaderCode = vertexSource + fragmentSource;
    while ((match = regex.exec(shaderCode)) != null) {
      name = match[2];
      program.locations[name] = gl.getUniformLocation(program.id, name);
    }

    return program;
  }

  private bindTexture(texture: WebGLTexture, unit?: number) {
    this.context.activeTexture(this.context.TEXTURE0 + (unit || 0));
    this.context.bindTexture(this.context.TEXTURE_2D, texture);
  }

  private extractUrl(value: string): string | null {
    const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
    if (urlMatch == null) {
      return null;
    }

    return urlMatch[1];
  }

  private isDataUri(url: string): boolean {
    return url.match(/^data:/) != null;
  }

  private handleUserDrop(
    pointer: MouseEvent | TouchEvent | Touch,
    big: boolean = false
  ) {
    if (this.visible && this.running && this.interactive) {
      this.dropAtPointer(
        pointer,
        this.dropRadius * (big ? 1.5 : 1),
        big ? 0.14 : 0.01
      );
    }
  }
  private handleMouseMove(e: MouseEvent) {
    this.handleUserDrop(e, false);
  }
  private handleMouseDown(e: MouseEvent) {
    this.handleUserDrop(e, true);
  }
  private handleTouchStart(e: TouchEvent) {
    this.handleUserDrop(e.changedTouches[0], true);
  }
  private handleTouchMove(e: TouchEvent) {
    const touches = e.changedTouches || e.touches;
    for (let i = 0; i < touches.length; i++) {
      this.handleUserDrop(touches[i], false);
    }
  }
  private setupPointerEvents() {
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onTouchMove = this.handleTouchMove.bind(this);
    this.onTouchStart = this.handleTouchStart.bind(this);
    this.onMouseDown = this.handleMouseDown.bind(this);
    this.$el.addEventListener('mousemove', this.onMouseMove);
    this.$el.addEventListener('touchmove', this.onTouchMove);
    this.$el.addEventListener('touchstart', this.onTouchStart);
    this.$el.addEventListener('mousedown', this.onMouseDown);
  }

  private loadImage() {
    let $elStyle: CSSStyleDeclaration;

    try {
      $elStyle = window.getComputedStyle(this.$el);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      $elStyle = this.$el.style;
    }
    const newImageSource =
      this.imageUrl ||
      this.extractUrl(this.originalCssBackgroundImage) ||
      this.extractUrl($elStyle.backgroundImage);

    if (newImageSource == this.imageSource) {
      return;
    }

    this.imageSource = newImageSource;

    if (!this.imageSource) {
      this.setTransparentTexture();
      return;
    }

    const image = new Image();
    image.onload = () => {
      const gl = this.context;
      if (gl instanceof WebGLRenderingContext === false) return;

      const isPowerOfTwo = (x: number) => {
        return (x & (x - 1)) == 0;
      };

      const wrapping =
        isPowerOfTwo(image.width) && isPowerOfTwo(image.height)
          ? gl.REPEAT
          : gl.CLAMP_TO_EDGE;

      if (this.backgroundTexture instanceof WebGLTexture === false) {
        throw new Error('backgroundTexture is not a WebGLTexture');
      }

      gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      this.backgroundWidth = image.width;
      this.backgroundHeight = image.height;

      this.hideCssBackground();
    };

    image.onerror = () => {
      this.setTransparentTexture();
    };

    image.crossOrigin = this.isDataUri(this.imageSource)
      ? null
      : this.crossOrigin;
    image.src = this.imageSource;
  }

  private step() {
    if (!this.visible) {
      return;
    }

    this.computeTextureBoundaries();

    if (this.running) {
      this.update();
    }

    this.render();
  }

  private drawQuad() {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.quad);
    this.context.vertexAttribPointer(0, 2, this.context.FLOAT, false, 0, 0);
    this.context.drawArrays(this.context.TRIANGLE_FAN, 0, 4);
  }

  private render() {
    const gl = this.context;
    if (!this.renderProgram) {
      return;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.enable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.renderProgram.id);

    if (this.backgroundTexture) this.bindTexture(this.backgroundTexture, 0);
    if (this.textures[0]) this.bindTexture(this.textures[0], 1);

    if (this.renderProgram.locations.perturbance) {
      gl.uniform1f(this.renderProgram.locations.perturbance, this.perturbance);
    }
    if (this.renderProgram.locations.topLeft) {
      gl.uniform2fv(
        this.renderProgram.locations.topLeft,
        this.renderProgram.uniforms.topLeft
      );
    }
    if (this.renderProgram.locations.bottomRight) {
      gl.uniform2fv(
        this.renderProgram.locations.bottomRight,
        this.renderProgram.uniforms.bottomRight
      );
    }
    if (this.renderProgram.locations.containerRatio) {
      gl.uniform2fv(
        this.renderProgram.locations.containerRatio,
        this.renderProgram.uniforms.containerRatio
      );
    }
    if (this.renderProgram.locations.samplerBackground) {
      gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
    }
    if (this.renderProgram.locations.samplerRipples) {
      gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);
    }

    this.drawQuad();
    gl.disable(gl.BLEND);
  }

  private update() {
    const gl = this.context;
    if (!this.updateProgram) {
      return;
    }

    gl.viewport(0, 0, this.resolution, this.resolution);
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      this.framebuffers[this.bufferWriteIndex]
    );
    this.bindTexture(this.textures[this.bufferReadIndex]);
    gl.useProgram(this.updateProgram.id);

    this.drawQuad();
    this.swapBufferIndices();
  }

  private swapBufferIndices() {
    this.bufferWriteIndex = 1 - this.bufferWriteIndex;
    this.bufferReadIndex = 1 - this.bufferReadIndex;
  }

  private computeTextureBoundaries() {
    let $elStyle: CSSStyleDeclaration;

    try {
      $elStyle = window.getComputedStyle(this.$el);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      $elStyle = this.$el.style;
    }

    let backgroundSize: string | string[] = $elStyle.backgroundSize;
    const backgroundAttachment = $elStyle.backgroundAttachment;
    const backgroundPosition = this.translateBackgroundPosition(
      $elStyle.backgroundPosition
    );

    let container: { left: number; top: number; width: number; height: number };
    if (backgroundAttachment === 'fixed') {
      container = {
        left: window.pageXOffset,
        top: window.pageYOffset,
        width: window.innerWidth,
        height: window.innerHeight
      };
    } else {
      container = {
        left: this.$el.offsetLeft,
        top: this.$el.offsetTop,
        width: this.$el.clientWidth,
        height: this.$el.clientHeight
      };
    }

    let backgroundWidth: number | string;
    let backgroundHeight: number | string;

    if (backgroundSize == 'cover') {
      const scale = Math.max(
        container.width / this.backgroundWidth,
        container.height / this.backgroundHeight
      );

      backgroundWidth = this.backgroundWidth * scale;
      backgroundHeight = this.backgroundHeight * scale;
    } else if (backgroundSize == 'contain') {
      const scale = Math.min(
        container.width / this.backgroundWidth,
        container.height / this.backgroundHeight
      );

      backgroundWidth = this.backgroundWidth * scale;
      backgroundHeight = this.backgroundHeight * scale;
    } else {
      backgroundSize = backgroundSize.split(' ');
      backgroundWidth = backgroundSize[0] || '';
      backgroundHeight = backgroundSize[1] || backgroundWidth;

      if (this.isPercentage(backgroundWidth)) {
        backgroundWidth =
          (container.width * parseFloat(backgroundWidth as string)) / 100;
      } else if (backgroundWidth != 'auto') {
        backgroundWidth = parseFloat(backgroundWidth);
      }

      if (this.isPercentage(backgroundHeight as string)) {
        backgroundHeight =
          (container.height * parseFloat(backgroundHeight as string)) / 100;
      } else if (backgroundHeight != 'auto') {
        backgroundHeight = parseFloat(backgroundHeight as string);
      }

      if (backgroundWidth == 'auto' && backgroundHeight == 'auto') {
        backgroundWidth = this.backgroundWidth;
        backgroundHeight = this.backgroundHeight;
      } else {
        if (backgroundWidth == 'auto') {
          backgroundWidth =
            this.backgroundWidth *
            ((backgroundHeight as number) / this.backgroundHeight);
        }
        if (backgroundHeight == 'auto') {
          backgroundHeight =
            this.backgroundHeight *
            ((backgroundWidth as number) / this.backgroundWidth);
        }
      }
    }

    let backgroundX: number | string = backgroundPosition[0];
    let backgroundY: number | string = backgroundPosition[1];

    if (this.isPercentage(backgroundX)) {
      backgroundX =
        container.left +
        ((container.width - (backgroundWidth as number)) *
          parseFloat(backgroundX)) /
          100;
    } else {
      backgroundX = container.left + parseFloat(backgroundX);
    }

    if (this.isPercentage(backgroundY as string)) {
      backgroundY =
        container.top +
        ((container.height - (backgroundHeight as number)) *
          parseFloat(backgroundY as string)) /
          100;
    } else {
      backgroundY = container.top + parseFloat(backgroundY as string);
    }

    const elementOffset = {
      top: this.$el.offsetTop,
      left: this.$el.offsetLeft
    };

    if (this.renderProgram) {
      this.renderProgram.uniforms = this.renderProgram.uniforms || {};
      this.renderProgram.uniforms.topLeft = new Float32Array([
        (elementOffset.left - (backgroundX as number)) /
          (backgroundWidth as number),
        (elementOffset.top - (backgroundY as number)) /
          (backgroundHeight as number)
      ]);
      this.renderProgram.uniforms.bottomRight = new Float32Array([
        this.renderProgram.uniforms.topLeft[0] +
          this.$el.clientWidth / (backgroundWidth as number),
        this.renderProgram.uniforms.topLeft[1] +
          this.$el.clientHeight / (backgroundHeight as number)
      ]);

      const maxSide = Math.max(this.canvas.width, this.canvas.height);

      this.renderProgram.uniforms.containerRatio = new Float32Array([
        this.canvas.width / maxSide,
        this.canvas.height / maxSide
      ]);
    }
  }

  private initShaders() {
    const gl = this.context;
    this.dropProgram = this.createProgram(basicVert, dropFrag);

    this.updateProgram = this.createProgram(basicVert, updateFrag);
    gl.uniform2fv(this.updateProgram.locations.delta, this.textureDelta);

    this.renderProgram = this.createProgram(renderVert, renderFrag);
    gl.uniform2fv(this.renderProgram.locations.delta, this.textureDelta);
  }

  private initTexture() {
    const gl = this.context;
    this.backgroundTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  private setTransparentTexture() {
    if (!this.backgroundTexture) return;
    const gl = this.context;
    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.transparentPixels
    );
  }

  private hideCssBackground() {
    let $elStyle: CSSStyleDeclaration;

    try {
      $elStyle = window.getComputedStyle(this.$el);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      $elStyle = this.$el.style;
    }
    const inlineCss = $elStyle.backgroundImage;

    if (inlineCss == 'none') {
      return;
    }

    this.originalInlineCss = inlineCss;
    this.originalCssBackgroundImage = this.$el.style.backgroundImage;
    this.$el.style.backgroundImage = 'none';
  }

  private restoreCssBackground() {
    // Restore background by either changing the inline CSS rule to what it was, or
    // simply remove the inline CSS rule if it never was inlined.

    this.$el.style.backgroundImage = this.originalInlineCss || '';
  }

  private dropAtPointer(
    pointer: MouseEvent | TouchEvent | Touch,
    radius: number,
    strength: number
  ) {
    let $elStyle: CSSStyleDeclaration;

    try {
      $elStyle = window.getComputedStyle(this.$el);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      $elStyle = this.$el.style;
    }
    const borderLeft = parseInt($elStyle.borderLeftWidth) || 0;
    const borderTop = parseInt($elStyle.borderTopWidth) || 0;

    const clientX =
      'clientX' in pointer
        ? pointer.clientX
        : (pointer as TouchEvent).touches[0].clientX;
    const clientY =
      'clientY' in pointer
        ? pointer.clientY
        : (pointer as TouchEvent).touches[0].clientY;
    const rect = this.$el.getBoundingClientRect();

    this.drop(
      clientX - rect.left - borderLeft,
      clientY - rect.top - borderTop,
      radius,
      strength
    );
  }

  /**
   * 在指定位置觸發水滴效果
   *
   * @param {number} x - 水滴 X 座標 (相對於元素左上角)
   * @param {number} y - 水滴 Y 座標 (相對於元素左上角)
   * @param {number} radius - 水滴半徑
   * @param {number} strength - 水滴強度 (建議值: 0.01 ~ 0.5)
   * @returns {void}
   *
   * @example
   * ripples.drop(100, 200, 20, 0.04);
   */
  public drop(x: number, y: number, radius: number, strength: number) {
    if (!this.dropProgram) return;

    const elWidth = this.$el.getBoundingClientRect().width;
    const elHeight = this.$el.getBoundingClientRect().height;
    const longestSide = Math.max(elWidth, elHeight);

    radius = radius / longestSide;

    const dropPosition = new Float32Array([
      (2 * x - elWidth) / longestSide,
      (elHeight - 2 * y) / longestSide
    ]);

    const gl = this.context;
    gl.viewport(0, 0, this.resolution, this.resolution);
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      this.framebuffers[this.bufferWriteIndex]
    );
    this.bindTexture(this.textures[this.bufferReadIndex]);

    gl.useProgram(this.dropProgram.id);
    if (this.dropProgram.locations.center) {
      gl.uniform2fv(this.dropProgram.locations.center, dropPosition);
    }
    if (this.dropProgram.locations.radius) {
      gl.uniform1f(this.dropProgram.locations.radius, radius);
    }
    if (this.dropProgram.locations.strength) {
      gl.uniform1f(this.dropProgram.locations.strength, strength);
    }

    this.drawQuad();
    this.swapBufferIndices();
  }

  /**
   * 更新 canvas 尺寸以匹配元素大小
   * @returns {void}
   */
  public updateSize() {
    const newWidth = this.$el.getBoundingClientRect().width;
    const newHeight = this.$el.getBoundingClientRect().height;

    if (newWidth != this.canvas.width || newHeight != this.canvas.height) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
    }
  }

  /**
   * 銷毀 Ripples 實例並清理資源
   * @returns {void}
   */
  public destroy() {
    if (typeof this.onMouseMove === 'function') {
      this.$el.removeEventListener('mousemove', this.onMouseMove);
    }
    if (typeof this.onTouchMove === 'function') {
      this.$el.removeEventListener('touchmove', this.onTouchMove);
    }
    if (typeof this.onTouchStart === 'function') {
      this.$el.removeEventListener('touchstart', this.onTouchStart);
    }
    if (typeof this.onMouseDown === 'function') {
      this.$el.removeEventListener('mousedown', this.onMouseDown);
    }
    this.$el.classList.remove('javascript-ripples');
    this.$el.ripples = undefined;

    if (typeof this.onWindowResize === 'function') {
      window.removeEventListener('resize', this.onWindowResize);
    }

    this.canvas.remove();
    this.restoreCssBackground();
    this.destroyed = true;
  }

  /**
   * 顯示水波紋效果
   * @returns {void}
   */
  public show() {
    this.visible = true;
    this.canvas.style.display = '';
    this.hideCssBackground();
  }

  /**
   * 隱藏水波紋效果
   * @returns {void}
   */
  public hide() {
    this.visible = false;
    this.canvas.style.display = 'none';
    this.restoreCssBackground();
  }

  /**
   * 暫停水波紋動畫
   * @returns {void}
   */
  public pause() {
    this.running = false;
  }

  /**
   * 繼續播放水波紋動畫
   * @returns {void}
   */
  public play() {
    this.running = true;
  }

  /**
   * 動態設定屬性值
   *
   * @param {string} property - 屬性名稱 ('dropRadius' | 'perturbance' | 'interactive' | 'crossOrigin' | 'imageUrl')
   * @param {*} value - 屬性值
   * @returns {void}
   */
  public set(property: string, value: string) {
    if (
      property === 'dropRadius' ||
      property === 'perturbance' ||
      property === 'interactive' ||
      property === 'crossOrigin'
    ) {
      (this as unknown as Record<string, unknown>)[property] = value;
    } else if (property === 'imageUrl') {
      this.imageUrl = value;
      this.loadImage();
    }
  }

  /**
   * 靜態入口方法 - 初始化或控制 Ripples 實例
   *
   * 此方法實現類似多載的功能：
   * - 傳入 options 物件：初始化新的 Ripples 實例
   * - 傳入字串命令：執行對應的實例方法 (如 'drop', 'pause', 'play', 'destroy')
   *
   * @param {HTMLElement|string} target - 目標元素或 CSS 選擇器
   * @param {RipplesOptions|string} option - 配置選項物件或命令字串
   * @param {...any} args - 額外參數 (用於 'drop' 等命令)
   * @returns {Ripples|undefined} 初始化時返回 Ripples 實例
   * @throws {Error} 瀏覽器不支援 WebGL 時拋出錯誤
   * @throws {Error} target 不是有效的 HTMLElement 時拋出錯誤
   * @static
   *
   * @example
   * // 初始化
   * const ripples = Ripples.ripples('#hero', { resolution: 512 });
   */
  static ripples(
    target: HTMLElement | string,
    option?: (RipplesOptions & { ripples?: Ripples }) | string,
    ...args: unknown[]
  ): Ripples | undefined {
    if (!Ripples.config) {
      throw new Error(
        'Your browser does not support WebGL, the OES_texture_float extension or rendering to floating point textures.'
      );
    }

    const targetElement =
      typeof target === 'string'
        ? (document.querySelector(target) as HTMLElement)
        : target;

    if (!(targetElement instanceof HTMLElement)) {
      throw new Error('Target is not an HTMLElement');
    }

    const rippable = targetElement as RipplesElement;
    const data = rippable.ripples;

    const options = {
      ...Ripples.DEFAULTS,
      ...(data ? { ripples: data } : {}),
      ...(typeof option === 'object' ? option : {})
    };

    if (!(data instanceof Ripples)) {
      rippable.ripples = new Ripples(rippable, options);
    } else if (typeof option === 'string') {
      const method = (
        data as unknown as Record<string, (...args: unknown[]) => void>
      )[option];
      if (typeof method === 'function') {
        method.apply(data, args);
      }
    }

    return rippable.ripples;
  }
}

export default Ripples;
