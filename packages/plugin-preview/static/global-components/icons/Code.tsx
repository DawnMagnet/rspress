const Code = ({ color = 'currentColor', ...props }) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={color}
    strokeWidth="4"
    {...props}
  >
    <path
      d="M16.7336 12.6863L5.41992 24L16.7336 35.3137M31.2551 12.6863L42.5688 24L31.2551 35.3137M27.1999 6.28003L20.9486 41.7331"
      strokeLinecap="butt"
    ></path>
  </svg>
);

export default Code;
