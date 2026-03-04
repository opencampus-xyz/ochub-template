import { TabNav } from '@/components/TabNav';

export default function Explore() {
  return (
    <main className="min-h-screen">
      <TabNav />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Explore</h1>
        <p className="text-gray-600 mb-8">
          This is a sample second tab. Replace it with your own content.
        </p>

        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 mb-4"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <p className="text-gray-400 text-sm">
            Add your explore content here
          </p>
        </div>
      </div>
    </main>
  );
}
