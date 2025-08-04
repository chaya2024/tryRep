import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Clock, Users } from 'lucide-react';
import { api } from '../../services/api';

interface Step {
  title: string;
  openingText: string;
  question: string;
  choices: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  instructorResponse: string;
  summary: string;
}

interface Script {
  _id: string;
  title: string;
  description: string;
  targetAge: { min: number; max: number };
  duration: number;
  steps: Step[];
  isActive: boolean;
  createdAt: string;
}

interface ScriptManagerProps {
  scripts: Script[];
  onScriptUpdate: () => void;
}

export const ScriptManager: React.FC<ScriptManagerProps> = ({ scripts, onScriptUpdate }) => {
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  const emptyScript: Omit<Script, '_id' | 'createdAt'> = {
    title: '',
    description: '',
    targetAge: { min: 8, max: 11 },
    duration: 30,
    steps: [],
    isActive: true
  };

  const emptyStep: Step = {
    title: '',
    openingText: '',
    question: '',
    choices: [
      { id: 'a', text: '', isCorrect: false },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false }
    ],
    instructorResponse: '',
    summary: ''
  };

  const handleCreateScript = () => {
    setEditingScript({ ...emptyScript, _id: 'new', createdAt: new Date().toISOString() });
    setIsCreating(true);
  };

  const handleEditScript = (script: Script) => {
    setEditingScript({ ...script });
    setIsCreating(false);
  };

  const handleSaveScript = async () => {
    if (!editingScript) return;

    try {
      if (isCreating) {
        const { _id, createdAt, ...scriptData } = editingScript;
        await api.post('/admin/scripts', scriptData);
      } else {
        const { _id, createdAt, ...scriptData } = editingScript;
        await api.put(`/admin/scripts/${_id}`, scriptData);
      }
      
      setEditingScript(null);
      setIsCreating(false);
      onScriptUpdate();
    } catch (error) {
      console.error('Error saving script:', error);
      alert('שגיאה בשמירת התסריט');
    }
  };

  const handleDeleteScript = async (scriptId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תסריט זה?')) {
      try {
        await api.delete(`/admin/scripts/${scriptId}`);
        onScriptUpdate();
      } catch (error) {
        console.error('Error deleting script:', error);
        alert('שגיאה במחיקת התסריט');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingScript(null);
    setIsCreating(false);
  };

  const addStep = () => {
    if (!editingScript) return;
    setEditingScript({
      ...editingScript,
      steps: [...editingScript.steps, { ...emptyStep }]
    });
  };

  const removeStep = (stepIndex: number) => {
    if (!editingScript) return;
    const newSteps = editingScript.steps.filter((_, index) => index !== stepIndex);
    setEditingScript({ ...editingScript, steps: newSteps });
  };

  const updateStep = (stepIndex: number, updatedStep: Step) => {
    if (!editingScript) return;
    const newSteps = [...editingScript.steps];
    newSteps[stepIndex] = updatedStep;
    setEditingScript({ ...editingScript, steps: newSteps });
  };

  const updateChoice = (stepIndex: number, choiceIndex: number, field: string, value: string | boolean) => {
    if (!editingScript) return;
    const newSteps = [...editingScript.steps];
    const step = { ...newSteps[stepIndex] };
    const choices = [...step.choices];
    choices[choiceIndex] = { ...choices[choiceIndex], [field]: value };
    step.choices = choices;
    newSteps[stepIndex] = step;
    setEditingScript({ ...editingScript, steps: newSteps });
  };

  // Edit Mode
  if (editingScript) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {isCreating ? 'יצירת תסריט חדש' : 'עריכת תסריט'}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={handleSaveScript}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>שמור</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"  
            >
              <X className="h-4 w-4" />
              <span>ביטול</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-xl font-bold text-gray-800 mb-4">מידע בסיסי</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם התסריט</label>
              <input
                type="text"
                value={editingScript.title}
                onChange={(e) => setEditingScript({ ...editingScript, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">משך בדקות</label>
              <input
                type="number"
                value={editingScript.duration}
                onChange={(e) => setEditingScript({ ...editingScript, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">גיל מינימום</label>
              <input
                type="number"
                value={editingScript.targetAge.min}
                onChange={(e) => setEditingScript({ 
                  ...editingScript, 
                  targetAge: { ...editingScript.targetAge, min: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">גיל מקסימום</label>
              <input
                type="number"
                value={editingScript.targetAge.max}
                onChange={(e) => setEditingScript({ 
                  ...editingScript, 
                  targetAge: { ...editingScript.targetAge, max: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
            <textarea
              value={editingScript.description}
              onChange={(e) => setEditingScript({ ...editingScript, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">שלבי השיעור</h3>
            <button
              onClick={addStep}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>הוסף שלב</span>
            </button>
          </div>

          {editingScript.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800">שלב {stepIndex + 1}</h4>
                <button
                  onClick={() => removeStep(stepIndex)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כותרת השלב</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(stepIndex, { ...step, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טקסט פתיחה</label>
                  <textarea
                    value={step.openingText}
                    onChange={(e) => updateStep(stepIndex, { ...step, openingText: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שאלה</label>
                  <textarea
                    value={step.question}
                    onChange={(e) => updateStep(stepIndex, { ...step, question: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אפשרויות תשובה</label>
                  {step.choices.map((choice, choiceIndex) => (
                    <div key={choice.id} className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={choice.isCorrect}
                        onChange={(e) => updateChoice(stepIndex, choiceIndex, 'isCorrect', e.target.checked)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <input
                        type="text"
                        value={choice.text}
                        onChange={(e) => updateChoice(stepIndex, choiceIndex, 'text', e.target.value)}
                        placeholder={`תשובה ${choice.id.toUpperCase()}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dir="rtl"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תגובת המנחה</label>
                  <textarea
                    value={step.instructorResponse}
                    onChange={(e) => updateStep(stepIndex, { ...step, instructorResponse: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סיכום השלב</label>
                  <textarea
                    value={step.summary}
                    onChange={(e) => updateStep(stepIndex, { ...step, summary: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">ניהול תסריטים</h2>
        <button
          onClick={handleCreateScript}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>תסריט חדש</span>
        </button>
      </div>

      {scripts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">אין תסריטים עדיין</h3>
          <p className="text-gray-500">צור תסריט ראשון כדי להתחיל</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {scripts.map((script) => (
            <div key={script._id} className="bg-white rounded-xl shadow-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{script.title}</h3>
                  <p className="text-gray-600 mb-3">{script.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>גילאי {script.targetAge.min}-{script.targetAge.max}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{script.duration} דקות</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {script.steps.length} שלבים
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedScript(expandedScript === script._id ? null : script._id)}
                    className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded transition-colors"
                  >
                    {expandedScript === script._id ? 'הסתר' : 'הצג פרטים'}
                  </button>
                  <button
                    onClick={() => handleEditScript(script)}
                    className="text-purple-500 hover:text-purple-700 p-2 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteScript(script._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedScript === script._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">שלבי השיעור:</h4>
                  <div className="space-y-3">
                    {script.steps.map((step, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-2">
                          שלב {index + 1}: {step.title}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">{step.question}</p>
                        <div className="text-xs text-gray-500">
                          {step.choices.length} אפשרויות תשובה
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};