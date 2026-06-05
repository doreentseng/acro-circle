type Props = {
  toasts: {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'delete';
  }[];
  onClose: (id: number) => void;
};

export function ToastContainer({ toasts, onClose }: Props) {
  return (
    <div
      className="
        md:w-[380px]
        w-[90%]
        fixed z-50
        left-1/2 -translate-x-1/2
        bottom-6
        sm:bottom-auto sm:top-6 sm:left-auto sm:right-6 sm:translate-x-0
        space-y-2
      "
    >
      {toasts.map((toast) => {
        const base =
          'px-4 py-3 rounded-md shadow-lg text-sm text-white font-medium animate-fadeIn';

        const style =
          toast.type === 'success'
            ? 'bg-green-600 dark:bg-green-700'
            : toast.type === 'error'
              ? 'bg-red-600 dark:bg-red-700'
              : toast.type === 'delete'
                ? 'bg-zinc-600 dark:bg-zinc-800'
                : 'bg-blue-600 dark:bg-blue-700';

        return (
          <div
            key={toast.id}
            onClick={() => onClose(toast.id)}
            className={`${base} ${style} cursor-pointer`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
