import type { ReactNode } from "react";
import { Slide, ToastContainer } from "react-toastify";

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

export default App;
