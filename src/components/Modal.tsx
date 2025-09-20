import { createPortal } from "react-dom";

export default function Modal({
  result = (e: any) => {},
  body = <>test</>,
  title = "",
  className = "max-w-[600px]",
  footer = "",
  showClose=true
}) {
  const close = () => {
    result({ event: "close" });
  };

  return (
    <>


     {createPortal(
        <>
          <div
            className="modal fixed inset-0 z-[999] flex justify-center items-center bg-black/50 p-4"
          >
            <div
              className={`relative w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto ${className} mx-auto`}
            >
              <div className="relative bg-white rounded-xl shadow dark:bg-gray-700">
                {title && (
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t dark:border-gray-600">
                    <h3 className="text-base lg:text-xl font-semibold text-gray-900 dark:text-white capitalize">
                      {title}
                    </h3>
                    {showClose && (
                      <button
                        type="button"
                        onClick={close}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    )}
                  </div>
                )}

                <div className={`${title ? 'p-4 md:p-5 space-y-4' : ''}`}>
                  {body}
                </div>

                {footer}

                {!title && showClose && (
                  <div className="mt-2 absolute right-2 top-1">
                    <span
                      className="material-symbols-outlined inline-block text-lg cursor-pointer"
                      onClick={close}
                    >
                      close
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    
    </>
  );
}
