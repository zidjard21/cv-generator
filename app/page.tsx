import UploadCVForm from "./components/upload-cv-form";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-start">
        <UploadCVForm />
      </main>
    </div>
  );
}
