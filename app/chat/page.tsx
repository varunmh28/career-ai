import { Show, SignIn } from "@clerk/nextjs";
import CareerChat from "@/components/CareerChat";

export default function ChatPage() {
  return (
    <div className="flex flex-col flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
      <Show when="signed-in">
        <CareerChat />
      </Show>

      <Show when="signed-out">
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Sign in to consult your Career AI Advisor
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Log in to start or resume your personalized, durable career session.
            </p>
          </div>
          <SignIn routing="hash" signUpUrl="/sign-up" />
        </div>
      </Show>
    </div>
  );
}
