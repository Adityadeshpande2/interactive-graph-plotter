import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

function App() {
  const [equations, setEquations] = useState([{ id: 1, expression: '', color: '#1f77b4' }]);
  const [darkMode, setDarkMode] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [error, setError] = useState('');

  const colors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const generatePlotData = () => {
    const newPlotData = [];
    setError('');

    equations.forEach((eq, index) => {
      if (!eq.expression.trim()) return;

      try {
        const xValues = Array.from({ length: 100 }, (_, i) => -10 + (i * 20/99));
        const yValues = xValues.map(x => {
          const scope = { x };
          return math.evaluate(eq.expression, scope);
        });

        newPlotData.push({
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          name: eq.expression,
          line: { color: eq.color }
        });
      } catch (err) {
        setError(`Error in equation ${index + 1}: ${err.message}`);
      }
    });

    setPlotData(newPlotData);
  };

  const addEquation = () => {
    const newId = equations.length + 1;
    const newColor = colors[equations.length % colors.length];
    setEquations([...equations, { id: newId, expression: '', color: newColor }]);
  };

  const removeEquation = (id) => {
    setEquations(equations.filter(eq => eq.id !== id));
  };

  const updateEquation = (id, expression) => {
    setEquations(equations.map(eq => 
      eq.id === id ? { ...eq, expression } : eq
    ));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Interactive Graph Plotter
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Equations
            </h2>
            {equations.map((eq) => (
              <div key={eq.id} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={eq.expression}
                  onChange={(e) => updateEquation(eq.id, e.target.value)}
                  placeholder="Enter equation (e.g., x^2, sin(x))"
                  className={`flex-1 p-2 rounded border ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                <button
                  onClick={() => removeEquation(eq.id)}
                  className={`px-3 py-2 rounded ${
                    darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-4">
              <button
                onClick={addEquation}
                className={`px-4 py-2 rounded ${
                  darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                }`}
              >
                Add Equation
              </button>
              <button
                onClick={generatePlotData}
                className={`px-4 py-2 rounded ${
                  darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                }`}
              >
                Plot
              </button>
            </div>
            {error && (
              <p className="mt-4 text-red-500">{error}</p>
            )}
          </div>

          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Plot
              data={plotData}
              layout={{
                title: 'Graph',
                paper_bgcolor: darkMode ? '#1f2937' : 'white',
                plot_bgcolor: darkMode ? '#1f2937' : 'white',
                font: { color: darkMode ? 'white' : 'black' },
                xaxis: {
                  gridcolor: darkMode ? '#374151' : '#e5e7eb',
                  zerolinecolor: darkMode ? '#374151' : '#e5e7eb',
                },
                yaxis: {
                  gridcolor: darkMode ? '#374151' : '#e5e7eb',
                  zerolinecolor: darkMode ? '#374151' : '#e5e7eb',
                },
              }}
              style={{ width: '100%', height: '400px' }}
              config={{ responsive: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 