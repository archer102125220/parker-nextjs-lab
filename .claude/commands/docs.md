# Generate Documentation

Generate comprehensive documentation for code, APIs, or components.

## Usage

Use this command when you need to:
- Document new components or functions
- Create API documentation
- Generate README files
- Add JSDoc/TSDoc comments
- Create usage guides

## Template

Please generate documentation for:

**Target**: [Specify file, component, API, or module]

**Documentation Type**:
- [ ] JSDoc/TSDoc comments
- [ ] README.md
- [ ] API documentation
- [ ] Component usage guide
- [ ] Architecture documentation

**Include**:
- [ ] Description and purpose
- [ ] Parameters/Props with types
- [ ] Return values
- [ ] Usage examples
- [ ] Edge cases and limitations
- [ ] Related components/functions

**Format**:
- Markdown for README/guides
- JSDoc/TSDoc for inline comments
- Include code examples
- Add visual examples (if UI component)

**Requirements**:
- ✅ Use clear, concise language
- ✅ Include TypeScript types
- ✅ Provide practical examples
- ✅ Document edge cases
- ✅ Link to related docs

## Example

```
Please generate documentation for:

**Target**: components/ImageUpload/index.tsx

**Documentation Type**:
- [x] JSDoc comments
- [x] Component usage guide (README.md)

**Include**:
- [x] Props interface with descriptions
- [x] Usage examples (basic and advanced)
- [x] Styling customization guide
- [x] Accessibility features
- [x] Browser compatibility

**Format**:
- README.md in component directory
- JSDoc for all exported functions
```

## JSDoc Template

```typescript
/**
 * Brief description of the component/function
 *
 * @param {Type} paramName - Description of parameter
 * @returns {Type} Description of return value
 *
 * @example
 * ```tsx
 * <Component prop="value" />
 * ```
 *
 * @see {@link RelatedComponent}
 */
```

## README Template

```markdown
# Component/Module Name

Brief description

## Installation

## Usage

### Basic Example

### Advanced Example

## Props/Parameters

## Styling

## Accessibility

## Browser Support

## Related
```

## Related Skills

- [File Organization](.agent/skills/file-organization/SKILL.md)
- [Coding Standards](docs/guides/coding-standards.md)
