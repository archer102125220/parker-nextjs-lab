import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

type TrackData = {
  event: string;
  url: string;
  [key: string]: any;
};

export function useGTMTrack(trackData: TrackData) {
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
