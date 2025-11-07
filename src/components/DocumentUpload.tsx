import React, { useState } from 'react';
import { Upload, FileText, Image, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Document } from '../types/onboarding';

interface DocumentUploadProps {
  documents: Document[];
  onDocumentUpload: (documentId: string, file: File) => void;
  onDocumentRemove: (documentId: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  documents, 
  onDocumentUpload, 
  onDocumentRemove 
}) => {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, documentId: string) => {
    e.preventDefault();
    setDragOver(documentId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, documentId: string) => {
    e.preventDefault();
    setDragOver(null);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onDocumentUpload(documentId, files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDocumentUpload(documentId, files[0]);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-6 h-6" />;
      case 'pdf': return <FileText className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identity': return 'border-blue-200 bg-blue-50';
      case 'education': return 'border-emerald-200 bg-emerald-50';
      case 'employment': return 'border-purple-200 bg-purple-50';
      case 'compliance': return 'border-amber-200 bg-amber-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Documents</h3>
        <p className="text-gray-600">Please upload the following documents to complete your onboarding process.</p>
      </div>

      {documents.map((document) => (
        <div
          key={document.id}
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
            dragOver === document.id ? 'border-indigo-400 bg-indigo-50' : 
            document.uploaded ? 'border-green-400 bg-green-50' : getCategoryColor(document.category)
          }`}
          onDragOver={(e) => handleDragOver(e, document.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, document.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                document.uploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {getFileIcon(document.type)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{document.name}</h4>
                <p className="text-sm text-gray-600">
                  {document.required ? 'Required' : 'Optional'} • 
                  {document.type.toUpperCase()} format
                </p>
                {document.uploadDate && (
                  <p className="text-xs text-gray-500">
                    Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {document.uploaded ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <button
                    onClick={() => onDocumentRemove(document.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  {document.required && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      accept={document.type === 'image' ? 'image/*' : document.type === 'pdf' ? '.pdf' : '*'}
                      onChange={(e) => handleFileSelect(e, document.id)}
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {!document.uploaded && (
            <div className="mt-4 text-center text-gray-500">
              <p className="text-sm">Drag and drop your file here, or click upload to browse</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentUpload;