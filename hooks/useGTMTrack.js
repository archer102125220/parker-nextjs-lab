import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

export function useGTMTrack(trackData) {
  useIsomorphicLayoutEffect(() => {
    try {
      const title = document.getElementsByTagName('title')[0].innerText;
      window.dataLayer.push({ ...trackData, title });
    } catch (error) {
      console.log(error);
    }
  }, []);
}

export default useGTMTrack;
