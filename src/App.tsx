import React, { useState } from 'react';
import { Send, Plus, FileText } from 'lucide-react';
import ChatPopup from './components/ChatPopup';

interface Tag {
  name: string;
  fullName: string;
}

interface Result {
  企业标准: {
    answer: string;
    tags: Tag[];
  };
  行业标准: {
    answer: string;
    tags: Tag[];
  };
  国际标准: {
    answer: string;
    tags: Tag[];
  };
}

function App() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<keyof Result | null>(null);

  const handleRun = async () => {
    setLoading(true);
    // Simulating API calls to three different standards
    const mockApiCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        answer: `针对 "${question}" 的结果`,
        tags: [
          { name: "文档A", fullName: "完整文档A名称" },
          { name: "文档B", fullName: "完整文档B名称" },
          { name: "文档C", fullName: "完整文档C名称" },
        ]
      };
    };

    try {
      const [resultA, resultB, resultC] = await Promise.all([
        mockApiCall(),
        mockApiCall(),
        mockApiCall()
      ]);

      setResults({ 企业标准: resultA, 行业标准: resultB, 国际标准: resultC });
    } catch (error) {
      console.error('获取结果时出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskMore = (test: keyof Result) => {
    setActiveChat(test);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">研发质量助手</h1>
        
        <div className="mb-6">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="输入要查询的问题"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleRun}
            disabled={loading || !question.trim()}
            className="bg-[#4757E5] text-white px-8 py-2 rounded-md hover:bg-[#3A46B8] focus:outline-none focus:ring-2 focus:ring-[#4757E5] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? '查询中...' : (
              <>
                查询 <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-4">
          {(['企业标准', '行业标准', '国际标准'] as const).map((test) => (
            <div key={test} className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{test}</h2>
              <div className="mb-2 whitespace-pre-wrap">
                {results?.[test].answer || '-'}
              </div>
              {results?.[test].tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {results[test].tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                      title={tag.fullName}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              {results?.[test] && (
                <button
                  onClick={() => handleAskMore(test)}
                  className="mt-2 bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center text-sm"
                >
                  深入询问 <Plus className="ml-1 h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeChat && results && (
        <ChatPopup
          test={activeChat}
          onClose={() => setActiveChat(null)}
          initialMessage={results[activeChat].answer}
        />
      )}
    </div>
  );
}

export default App;