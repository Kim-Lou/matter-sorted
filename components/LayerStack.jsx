'use client';
import { useState } from 'react';

const LAYERS = [
  { label: '感知层', en: 'Perception', band: 'RGB · NIR · 激光 · X光', color: '#E8622C',
    desc: { zh: 'RGB、近红外、激光、X光多路传感器为何要在像素级而非决策级融合。', en: 'Why RGB, NIR, laser, and X-ray must fuse at the pixel level, not the decision level.' } },
  { label: '决策层', en: 'Decision', band: '分类推理', color: '#C97A3E',
    desc: { zh: '从光谱特征到材质标签，模型架构如何被产线节拍反向约束。', en: 'From spectral features to material labels — how line takt time constrains model design.' } },
  { label: '执行层', en: 'Execution', band: '抓取 / 分流', color: '#4A7A6E',
    desc: { zh: '决策输出变成机械动作时，延迟和精度的取舍发生在哪一层。', en: 'Where the latency/precision trade-off actually happens when decisions become motion.' } },
  { label: '运营层', en: 'Operations', band: '产线优化', color: '#3E7CA6',
    desc: { zh: '设施级 AI 优化多数时候不是模型问题，而是数据流问题。', en: 'Facility-level AI optimization is usually a data-flow problem, not a model problem.' } },
];

export default function LayerStack({ locale = 'zh' }) {
  const [active, setActive] = useState(null);
  return (
    <div style={{ width: '100%' }}>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.label}
          className="layer-row"
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          style={{
            borderTop: i === 0 ? '1px solid var(--border)' : 'none',
            borderBottom: '1px solid var(--border)',
            background: active === i ? 'var(--surface)' : 'transparent',
            transition: 'background 0.2s ease',
          }}
        >
          <div style={{ width: 5, background: layer.color, flexShrink: 0 }} />
          <div className="layer-row-body">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, minWidth: 220 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--muted)', width: 20 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: 'var(--text)' }}>
                {locale === 'en' ? layer.en : layer.label}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: layer.color }}>
                {layer.band}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
                color: active === i ? 'var(--text)' : 'var(--muted)',
                maxWidth: 460,
                margin: 0,
                transition: 'color 0.2s ease',
              }}
            >
              {layer.desc[locale] || layer.desc.zh}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
