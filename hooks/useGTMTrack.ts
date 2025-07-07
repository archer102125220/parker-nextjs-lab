import { useEffect } from 'react';

type TrackData = {
  event: string;
  url: string;
  [key: string]: any;
};

function handleGtmTrack(trackData: TrackData) {
  try {
    if (typeof window !== 'object') return;

    if (Array.isArray(window.dataLayer) === false) {
      return setTimeout(() => handleGtmTrack(trackData), 200);
    }

    const title =
      document.getElementsByTagName('title')[0].innerText || trackData?.title;

    window.dataLayer.push({ ...trackData, title });
  } catch (error) {
    console.log(error);
  }
}
export function useGTMTrack(trackData: TrackData) {
  useEffect(() => {
    handleGtmTrack(trackData);
  }, []);
}

export default useGTMTrack;
