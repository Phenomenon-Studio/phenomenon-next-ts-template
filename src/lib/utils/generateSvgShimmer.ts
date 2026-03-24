export const generateSvgShimmer = (w: number, h: number) => {
    return `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
      <stop stop-color="#cbddff" offset="20%" stop-opacity="0.2" />
      <stop stop-color="#7988ff" offset="50%" stop-opacity="0.2" />
        <stop stop-color="#cbddff" offset="70%" stop-opacity="0.2" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#7988ff" rx="100" opacity="0.2" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" rx="100" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;
};
