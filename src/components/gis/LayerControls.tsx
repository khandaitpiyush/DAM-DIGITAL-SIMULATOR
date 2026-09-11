import React from 'react';
import { Layers, Eye, EyeOff, Sliders } from 'lucide-react';
import { GISLayer } from '../../types/gis';

interface LayerControlsProps {
  layers: GISLayer[];
  onToggleLayer: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  layers,
  onToggleLayer,
  onChangeOpacity,
}) => {
  return (
    <div className="w-72 bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow-xl flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="font-mono text-xs font-bold text-slate-100 tracking-wider uppercase">
            GIS LAYER MANAGER
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {layers.filter((l) => l.visible).length} / {layers.length} Active
        </span>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`p-2 rounded border transition-colors ${
              layer.visible
                ? 'bg-[#0B0F17] border-slate-800'
                : 'bg-slate-900/40 border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => onToggleLayer(layer.id)}
                  className="accent-cyan-400 w-3.5 h-3.5 rounded cursor-pointer"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[150px]">
                  {layer.name}
                </span>
              </label>

              <button
                onClick={() => onToggleLayer(layer.id)}
                className="text-slate-400 hover:text-slate-200"
              >
                {layer.visible ? (
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                )}
              </button>
            </div>

            {/* Opacity slider */}
            {layer.visible && (
              <div className="pt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={layer.opacity}
                  onChange={(e) => onChangeOpacity(layer.id, parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded"
                />
                <span className="w-7 text-right">{layer.opacity}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
