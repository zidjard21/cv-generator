"use client";

import { useState } from "react";

export default function UploadCVForm() {
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cvUploaded, setCvUploaded] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCVFile(file);
      setCvFileName(file.name);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!cvFile) {
      setError("Please upload a CV file");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("cvFile", cvFile);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/process-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.error || "Failed to process CV",
        );
      }

      const data = await response.json();
      // console.log('AI response data:', data); // Log the entire response from the AI
      const rawString = data.result;

      const startIndex = rawString.indexOf("{");
      const endIndex = rawString.lastIndexOf("}");

      const cleanJsonString = rawString.substring(startIndex, endIndex + 1);

      const resumeObject = JSON.parse(cleanJsonString);

      // console.log('resumeObject', resumeObject); // Output the entire resume object to the console

      // Generate PDF from resumeObject
      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeObject),
      });

      if (!pdfResponse.ok) {
        const errorBody = await pdfResponse.json().catch(() => null);
        throw new Error(errorBody?.error || "Failed to generate PDF");
      }

      const pdfBlob = await pdfResponse.blob();
      const fileName = pdfResponse.headers.get("content-disposition")?.split('filename="')[1]?.slice(0, -1) || "resume.pdf";
      setPdfBlob(pdfBlob);
      setPdfFileName(fileName);

      setSuccess("CV processed and PDF generated successfully!");

      setCvUploaded(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "An error occurred while processing your CV");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          CV Generator
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Upload your CV and paste a job description to create a tailored CV
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div>
            {!cvUploaded ? (
              <>
                <label
                  htmlFor="cv-file"
                  className="block text-sm font-medium text-black dark:text-white mb-2"
                >
                  Upload Your CV
                </label>
                <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-6 transition hover:border-zinc-400 dark:hover:border-zinc-500">
                  <input
                    id="cv-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-zinc-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v28a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v12m0 0l-3-3m3 3l3-3"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-black dark:text-white">
                      {cvFile
                        ? cvFile.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      PDF, DOC, DOCX, or TXT
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-black dark:text-white mb-2">
                  Your uploaded CV:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={cvFile ? URL.createObjectURL(cvFile) : "#"}
                    download={cvFileName}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    {cvFileName.length > 35
                      ? cvFileName.slice(0, 35) + "..." + cvFileName.slice(-10)
                      : cvFileName}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setCVFile(null);
                      setCvFileName("");
                      setCvUploaded(false);
                    }}
                    className="text-sm text-zinc-500 hover:text-zinc-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div>
            <label
              htmlFor="job-description"
              className="block text-sm font-medium text-black dark:text-white mb-2"
            >
              Job Description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-40 px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-400">
                {success}
              </p>
              {pdfBlob && (
                <a
                  href={URL.createObjectURL(pdfBlob)}
                  download={pdfFileName}
                  className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Download PDF
                </a>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-medium py-3 rounded-lg transition"
          >
            {loading ? "Processing..." : "Create CV"}
          </button>
        </form>
      </div>
    </div>
  );
}
