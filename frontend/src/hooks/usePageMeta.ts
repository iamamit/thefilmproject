import { useEffect } from 'react';

export function usePageMeta(title?: string, description?: string): void {
  useEffect(() => {
    const defaultTitle = "TheFilmProject — India's Film Creator Network";
    const defaultDesc = "Connect with directors, editors, musicians and more from India's film industry.";

    const prev = document.title;
    document.title = title ? `${title} | TheFilmProject` : defaultTitle;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const prevContent = metaDesc.content;
    metaDesc.content = description || defaultDesc;

    return () => {
      document.title = prev;
      if (metaDesc) metaDesc.content = prevContent;
    };
  }, [title, description]);
}
