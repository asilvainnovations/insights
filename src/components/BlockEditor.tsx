import React, { useState, useCallback } from 'react';
import {
  Type, Image, Video, Quote, Code, AlertCircle, AlertTriangle, CheckCircle,
  Table, HelpCircle, Twitter, Minus, MousePointer, GripVertical, Plus, Trash2,
  Eye, Save, Clock, Loader2, ChevronDown, Bold, Italic, Link, List
} from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
}

interface BlockEditorProps {
  onSave?: (data: { title: string; excerpt: string; blocks: Block[]; category: string }) => void;
}

const BLOCK_TYPES = [
  { type: 'paragraph', icon: Type, label: 'Paragraph' },
  { type: 'heading-2', icon: Type, label: 'Heading 2' },
  { type: 'heading-3', icon: Type, label: 'Heading 3' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video Embed' },
  { type: 'quote', icon: Quote, label: 'Pull Quote' },
  { type: 'code', icon: Code, label: 'Code Block' },
  { type: 'callout-info', icon: AlertCircle, label: 'Info Callout' },
  { type: 'callout-warning', icon: AlertTriangle, label: 'Warning Callout' },
  { type: 'callout-success', icon: CheckCircle, label: 'Success Callout' },
  { type: 'table', icon: Table, label: 'Table' },
  { type: 'faq', icon: HelpCircle, label: 'FAQ Accordion' },
  { type: 'tweet', icon: Twitter, label: 'Tweet Embed' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'button', icon: MousePointer, label: 'Button' },
];

const CATEGORIES = [
  'Systems Innovations',
  'Integrated Risk Management',
  'Resilience',
  'AI and Analytics',
  'Real-Time Leadership',
];

export default function BlockEditor({ onSave }: BlockEditorProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '' }
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = (type: string, index: number) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: '',
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setShowBlockMenu(false);
    setInsertIndex(null);
    setActiveBlockId(newBlock.id);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedBlock && draggedBlock !== targetId) {
      const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
      const targetIndex = blocks.findIndex(b => b.id === targetId);
      
      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, removed);
      setBlocks(newBlocks);
    }
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setSaving(false);
    
    if (onSave) {
      onSave({ title, excerpt, blocks, category });
    }
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'heading-2':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Heading 2"
            className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
          />
        );
      case 'heading-3':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Heading 3"
            className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Enter image URL"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {block.content && (
              <img src={block.content} alt="" className="w-full rounded-lg" />
            )}
          </div>
        );
      case 'video':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Enter YouTube or Vimeo URL"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'quote':
        return (
          <div className="border-l-4 border-blue-500 pl-4">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Enter quote..."
              className="w-full text-xl italic text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
              rows={3}
            />
          </div>
        );
      case 'code':
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="// Enter code..."
            className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={6}
          />
        );
      case 'callout-info':
        return (
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Info callout content..."
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-blue-800"
              rows={2}
            />
          </div>
        );
      case 'callout-warning':
        return (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Warning callout content..."
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-amber-800"
              rows={2}
            />
          </div>
        );
      case 'callout-success':
        return (
          <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Success callout content..."
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-green-800"
              rows={2}
            />
          </div>
        );
      case 'divider':
        return <hr className="border-gray-300 my-4" />;
      case 'faq':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content.split('|||')[0] || ''}
              onChange={(e) => updateBlock(block.id, `${e.target.value}|||${block.content.split('|||')[1] || ''}`)}
              placeholder="Question"
              className="w-full px-4 py-2 font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={block.content.split('|||')[1] || ''}
              onChange={(e) => updateBlock(block.id, `${block.content.split('|||')[0] || ''}|||${e.target.value}`)}
              placeholder="Answer"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        );
      default:
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Start writing..."
            className="w-full text-lg text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 resize-none leading-relaxed"
            rows={3}
          />
        );
    }
  };

  const renderPreview = () => (
    <div className="prose prose-lg max-w-none">
      <h1>{title || 'Untitled Article'}</h1>
      <p className="lead text-xl text-gray-600">{excerpt}</p>
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading-2':
            return <h2 key={block.id}>{block.content}</h2>;
          case 'heading-3':
            return <h3 key={block.id}>{block.content}</h3>;
          case 'image':
            return block.content ? <img key={block.id} src={block.content} alt="" className="rounded-lg" /> : null;
          case 'quote':
            return <blockquote key={block.id} className="border-l-4 border-blue-500 pl-4 italic">{block.content}</blockquote>;
          case 'code':
            return <pre key={block.id} className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto"><code>{block.content}</code></pre>;
          case 'divider':
            return <hr key={block.id} />;
          default:
            return <p key={block.id}>{block.content}</p>;
        }
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Editor Header */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              {lastSaved && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  isPreview 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isPreview ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {renderPreview()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              className="w-full text-4xl md:text-5xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 mb-4"
            />

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a compelling excerpt that summarizes your article..."
              className="w-full text-xl text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 resize-none mb-8"
              rows={2}
            />

            <hr className="mb-8" />

            {/* Blocks */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onDragOver={(e) => handleDragOver(e, block.id)}
                  onDragEnd={handleDragEnd}
                  className={`group relative ${
                    activeBlockId === block.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
                  } ${draggedBlock === block.id ? 'opacity-50' : ''}`}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  {/* Block Controls */}
                  <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Block Content */}
                  <div className="relative">
                    {renderBlockContent(block)}
                    
                    {/* Delete Button */}
                    {blocks.length > 1 && activeBlockId === block.id && (
                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="absolute -right-10 top-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Add Block Button */}
                  <div className="relative h-8 -mb-4">
                    <button
                      onClick={() => {
                        setInsertIndex(index);
                        setShowBlockMenu(true);
                      }}
                      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Block Type Menu */}
            {showBlockMenu && insertIndex !== null && (
              <div className="fixed inset-0 z-50" onClick={() => setShowBlockMenu(false)}>
                <div 
                  className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 p-2 w-64 max-h-96 overflow-y-auto"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Add Block
                  </p>
                  {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type, insertIndex)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
