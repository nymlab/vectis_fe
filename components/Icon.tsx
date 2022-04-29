export function IconInfo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="stroke-current flex-shrink-0 w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
}

export function IconSuccess() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current flex-shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function IconWarning() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current flex-shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export function IconError() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current flex-shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function IconTrash() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" fill="none" width="24" height="24" />
      <g>
        <path
          fill="#FFF"
          d="M6.187 8h11.625l-.695 11.125C17.05 20.18 16.177 21 15.12 21H8.88c-1.057 0-1.93-.82-1.997-1.875L6.187 8zM19 5v2H5V5h3V4c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v1h3zm-9 0h4V4h-4v1z"
        />
      </g>
    </svg>
  );
}

export function IconChip({ fill }) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 32 32"
      enableBackground="new 0 0 32 32"
    >
      <path
        fill={fill}
        id="chip--credit_1_"
        d="M29,28.36H3c-1.301,0-2.36-1.059-2.36-2.36V6c0-1.301,1.059-2.36,2.36-2.36h26
	c1.302,0,2.36,1.059,2.36,2.36v20C31.36,27.302,30.302,28.36,29,28.36z M22.36,27.64H29c0.904,0,1.64-0.735,1.64-1.64v-3.64h-8.28
	V27.64z M10.36,27.64h11.28V10c0-0.199,0.161-0.36,0.36-0.36h8.64V6c0-0.904-0.735-1.64-1.64-1.64H10.36V27.64z M1.36,22.36V26
	c0,0.904,0.736,1.64,1.64,1.64h6.64v-5.28H1.36z M22.36,21.64h8.279v-5.28H22.36V21.64z M1.36,21.64h8.28v-5.28H1.36V21.64z
	 M22.36,15.64h8.279v-5.28H22.36V15.64z M1.36,15.64h8.28v-5.28H1.36V15.64z M1.36,9.64h8.28V4.36H3C2.096,4.36,1.36,5.096,1.36,6
	V9.64z"
      />
      <rect id="_Transparent_Rectangle" fill="none" width="32" height="32" />
    </svg>
  );
}
