import { Button } from "@heroui/react";

export const App = () => {
  return (
    <main className="w-full min-h-screen flex gap-4 flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Hello world!</h1>
      <p className="text-lg text-gray-700">
        This is a simple example of using Tailwind CSS with React.
      </p>
      <Button color="primary" className="font-semibold">Press button</Button>
    </main>
  );
};
