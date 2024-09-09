import { debounce } from "radash";

export function stickyScrollListener(offsetTop: number, onChangeStickyTop: (stickyTop: number) => void) {
  const onScroll = debounce({ delay: 100 }, (event) => {
    const diffTop = event.target.scrollTop - offsetTop;
    onChangeStickyTop(diffTop > 0 ? diffTop : 0);
  });
  document.getElementById("route-view")?.addEventListener("scroll", onScroll);
  return () => {
    document.getElementById("route-view")?.removeEventListener("scroll", onScroll);
  };
}
