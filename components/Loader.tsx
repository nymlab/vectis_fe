import { ReactNode } from "react";

type LoaderProps = { children?: ReactNode };
function Loader({ children }: LoaderProps) {
  return (
    <div className="flex flex-col justify-center items-center my-5">
      <p className="mb-5 text-2xl">{children}</p>
      <div
        className="bg-secondary p-5 rounded-full flex space-x-3"
        style={{ animationDuration: "0.5s" }}
      >
        <div
          className="w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className="w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  );
}

export default Loader;
