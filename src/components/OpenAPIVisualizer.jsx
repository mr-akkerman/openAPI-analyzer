import { useState } from 'react';
import { ChevronDown, ChevronRight, Code, AlertCircle, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const methodColors = {
  get: 'bg-blue-500',
  post: 'bg-green-500',
  put: 'bg-yellow-500',
  delete: 'bg-red-500',
  patch: 'bg-purple-500'
};

const OpenAPIVisualizer = () => {
  const [openAPI, setOpenAPI] = useState(null);
  const [jsonError, setJsonError] = useState('');
  const [expandedPaths, setExpandedPaths] = useState({});
  const [expandedSchemas, setExpandedSchemas] = useState({});
  const [activeTab, setActiveTab] = useState('endpoints');

  const handleInputChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setOpenAPI(parsed);
      setJsonError('');
    } catch (error) {
      setJsonError(`Invalid JSON format: ${error.message}`);
      setOpenAPI(null);
    }
  };

  const togglePath = (path) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const toggleSchema = (schema) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [schema]: !prev[schema]
    }));
  };

  const renderParameters = (parameters) => {
    if (!parameters || parameters.length === 0) return null;

    return (
      <div className="ml-6 mt-2">
        <h4 className="text-gray-300 text-sm font-semibold mb-2">Parameters:</h4>
        {parameters.map((param, index) => (
          <div key={index} className="mb-2 bg-gray-800 rounded p-2">
            <div className="flex items-center">
              <span className="text-gray-300 font-medium">{param.name}</span>
              <span className="ml-2 text-gray-400 text-sm">({param.in})</span>
              {param.required && (
                <span className="ml-2 text-red-400 text-sm">required</span>
              )}
            </div>
            {param.description && (
              <p className="text-gray-400 text-sm mt-1">{param.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSchemaProperties = (properties, required = []) => {
    if (!properties) return null;

    return Object.entries(properties).map(([propName, propDetails]) => (
      <div key={propName} className="ml-4 mt-2">
        <div className="flex items-center">
          <span className="text-gray-300 font-medium">{propName}</span>
          <span className="ml-2 text-gray-400 text-sm">
            ({propDetails.type || 'object'})
          </span>
          {required.includes(propName) && (
            <span className="ml-2 text-red-400 text-sm">required</span>
          )}
        </div>
        {propDetails.description && (
          <p className="text-gray-400 text-sm ml-4">{propDetails.description}</p>
        )}
      </div>
    ));
  };

  const renderRequestBody = (requestBody) => {
    if (!requestBody) return null;

    return (
      <div className="ml-6 mt-2">
        <h4 className="text-gray-300 text-sm font-semibold mb-2">Request Body:</h4>
        <div className="bg-gray-800 rounded p-2">
          {Object.entries(requestBody.content).map(([mediaType, content]) => (
            <div key={mediaType} className="mb-2">
              <div className="text-gray-300 font-medium">{mediaType}</div>
              {content.schema && content.schema.$ref && (
                <div className="text-blue-400 text-sm ml-2">
                  {content.schema.$ref.split('/').pop()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResponses = (responses) => {
    if (!responses) return null;

    return (
      <div className="ml-6 mt-2">
        <h4 className="text-gray-300 text-sm font-semibold mb-2">Responses:</h4>
        {Object.entries(responses).map(([code, response]) => (
          <div key={code} className="mb-2 bg-gray-800 rounded p-2">
            <div className="text-gray-300 font-medium">
              {code} - {response.description}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">OpenAPI Analyzer</h1>

        <div className="w-full mb-8">
          <textarea
            className="w-full min-h-[200px] bg-gray-800 text-gray-200 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Paste your OpenAPI JSON specification here..."
            onChange={handleInputChange}
          />
          {jsonError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{jsonError}</AlertDescription>
            </Alert>
          )}
        </div>

        {openAPI && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">API Information</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{openAPI.info.title}</h3>
                <p className="text-gray-400 mt-2">{openAPI.info.description}</p>
                <p className="text-gray-400 mt-2">Version: {openAPI.info.version}</p>
              </div>
            </div>

            <div className="flex space-x-4 mb-6 border-b border-gray-700">
              <button
                className={`px-4 py-2 font-semibold transition-colors duration-200 border-b-2 ${
                  activeTab === 'endpoints'
                    ? 'text-blue-500 border-blue-500'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('endpoints')}
              >
                Endpoints
              </button>
              <button
                className={`px-4 py-2 font-semibold transition-colors duration-200 border-b-2 ${
                  activeTab === 'models'
                    ? 'text-blue-500 border-blue-500'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('models')}
              >
                Models
              </button>
            </div>

            {activeTab === 'endpoints' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
                {Object.entries(openAPI.paths).map(([path, methods]) => (
                  <div key={path} className="mb-4 bg-gray-800 rounded-lg overflow-hidden">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-700 flex items-center"
                      onClick={() => togglePath(path)}
                    >
                      {expandedPaths[path] ? (
                        <ChevronDown className="w-5 h-5 mr-2" />
                      ) : (
                        <ChevronRight className="w-5 h-5 mr-2" />
                      )}
                      <Code className="w-5 h-5 mr-2" />
                      <span className="font-mono">{path}</span>
                    </div>

                    {expandedPaths[path] && (
                      <div className="border-t border-gray-700">
                        {Object.entries(methods).map(([method, details]) => (
                          <div key={method} className="p-4 border-b border-gray-700 last:border-b-0">
                            <div className="flex items-center">
                              <span className={`${methodColors[method]} px-3 py-1 rounded-full text-sm font-bold uppercase`}>
                                {method}
                              </span>
                              <span className="ml-4 font-semibold">{details.summary}</span>
                              {details.security ? (
                                <div className="ml-3 flex items-center text-yellow-500" title="Requires Authentication">
                                  <Lock className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="ml-3 flex items-center text-green-500" title="Public Endpoint">
                                  <Unlock className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {details.description && (
                              <p className="text-gray-400 mb-4">{details.description}</p>
                            )}

                            {details.security && details.security.length > 0 && (
                              <div className="mb-4 px-4 py-2 bg-gray-700 rounded-md">
                                <div className="flex items-center text-yellow-500">
                                  <Lock className="w-4 h-4 mr-2" />
                                  <span className="text-sm">
                                    Authentication Required: {details.security.map(sec =>
                                      Object.keys(sec).join(', ')).join(' or ')}
                                  </span>
                                </div>
                              </div>
                            )}

                            {renderParameters(details.parameters)}
                            {renderRequestBody(details.requestBody)}
                            {renderResponses(details.responses)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'models' && openAPI.components?.schemas && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Models</h2>
                {Object.entries(openAPI.components.schemas).map(([schemaName, schema]) => (
                  <div key={schemaName} className="mb-4 bg-gray-800 rounded-lg overflow-hidden">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-700 flex items-center"
                      onClick={() => toggleSchema(schemaName)}
                    >
                      {expandedSchemas[schemaName] ? (
                        <ChevronDown className="w-5 h-5 mr-2" />
                      ) : (
                        <ChevronRight className="w-5 h-5 mr-2" />
                      )}
                      <span className="font-medium">{schemaName}</span>
                    </div>

                    {expandedSchemas[schemaName] && (
                      <div className="p-4 border-t border-gray-700">
                        {schema.description && (
                          <p className="text-gray-400 mb-4">{schema.description}</p>
                        )}
                        {renderSchemaProperties(schema.properties, schema.required)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenAPIVisualizer;