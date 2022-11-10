import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const router = useRouter();

  // Input Text
  const [input, setInput] = useState('');

  // Config Error
  const [error, SetError] = useState(false);

  // return after error
  useEffect(() => {
    if (input.length < 30) SetError(false);
  }),
    [input];

  // show output field
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  // api routes
  const submit = async () => {
    // check if charecter limit is exceeded
    if (input.length > 30) return SetError(true);

    // set loading state
    setLoading(true);

    try {
      // fetch api
      const res = await fetch('/api/marketing-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      // Output filed
      const suggestion: { result: string } = await res.json();
      const { result } = suggestion;
      // console.log(suggestion);
      setSuggestion(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Main
        meta={
          <Meta
            title="AI API TESTING"
            description="This AI Application use cases for demo."
          />
        }
      ></Main>
      <div>
        <h2 className="text-2xl font-bold text-center pb-2">
          Marketing Copy Generator
        </h2>
        {/* Input field for marketing copy */}
        <div className="flex flex-col gap-4 justify-center w-1/3 mx-auto">
          <div className="relative w-full">
            {/* Error Message */}
            {error && (
              <p className="text-xs pt-1 text-red-500">
                Charater limit exceeded, please enter less text.
              </p>
            )}
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border-2 border-gray-300 bg-white p-4 rounded-lg text-sm focus:outline-none resize-none"
              placeholder="Enter your topic copy here..."
            />
            {/* Charecter limit in bottom right of textarea */}
            <div
              className={`absolute ${
                input.length > 30 ? 'text-red-500' : 'text-gray-400'
              } bottom-2 right-2 text-xs`}
            >
              <span>{input.length}</span>/30
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            className="bg-blue-500 h-12 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-4">
                <p>Loading...</p>
                <MoonLoader size={20} color="white" />
              </div>
            ) : (
              'Generate'
            )}
          </button>

          {/* Output field for marketing copy */}
          {suggestion && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold pb-2">
                Your marketing copy:
              </h4>
              <div className="relative w-full rounded-md bg-gray-100 p-4">
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
