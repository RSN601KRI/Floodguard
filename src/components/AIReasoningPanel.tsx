import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { ZoneRiskPrediction } from '@/engine/agents/riskPredictor';
import type { EvacuationSummary } from '@/engine/agents/evacuationPlanner';

interface AIReasoningPanelProps {
  predictions: ZoneRiskPrediction[];
  evacuation: EvacuationSummary;
  pipelineRunCount: number;
}

interface ReasoningStep {
  label: string;
  detail: string;
  type: 'input' | 'analysis' | 'decision';
}

function generateReasoning(predictions: ZoneRiskPrediction[], evacuation: EvacuationSummary): { summary: string; steps: ReasoningStep[] } {
  const highRisk = predictions.filter((p) => p.riskLevel === 'high');
  const worst = predictions[0]; // already sorted by score desc

  if (!worst) return { summary: 'Insufficient data for analysis.', steps: [] };

  const steps: ReasoningStep[] = [
    {
      label: 'Signal Ingestion',
      detail: `Analyzed ${predictions.length} zones. River sensors: ${worst.breakdown.riverComponent}% threat. Rainfall: ${worst.breakdown.rainfallComponent}% intensity.`,
      type: 'input',
    },
    {
      label: 'Satellite Correlation',
      detail: `Satellite flood extent at ${worst.breakdown.satelliteComponent}%. Social intelligence signals at ${worst.breakdown.socialComponent}%.`,
      type: 'input',
    },
    {
      label: 'Risk Assessment',
      detail: `${worst.zoneName} computed risk: ${worst.riskScore}% (${worst.riskLevel}). Trend: ${worst.trend}. Confidence: ${Math.round(worst.confidence * 100)}%.`,
      type: 'analysis',
    },
  ];

  if (highRisk.length > 0) {
    steps.push({
      label: 'Flood Prediction',
      detail: `${highRisk.length} zone(s) at HIGH risk. ${worst.zoneName} expected to flood in ${worst.predictedFloodTime}. Immediate response recommended.`,
      type: 'analysis',
    });
  }

  if (evacuation.activePlans.length > 0) {
    const immediatePlans = evacuation.activePlans.filter((p) => p.priority === 'immediate');
    steps.push({
      label: 'Decision Output',
      detail: `Evacuate ${evacuation.totalPeopleAtRisk.toLocaleString()} people across ${evacuation.activePlans.length} zones. ${immediatePlans.length} immediate, ${evacuation.totalVehiclesNeeded} vehicles required.`,
      type: 'decision',
    });
  } else {
    steps.push({
      label: 'Decision Output',
      detail: 'No evacuation required at this time. Continue monitoring all zones.',
      type: 'decision',
    });
  }

  const summary = highRisk.length > 0
    ? `Due to ${worst.trend === 'worsening' ? 'continuous' : 'sustained'} rainfall and rising river levels, ${worst.zoneName} is expected to flood within ${worst.predictedFloodTime}. ${evacuation.activePlans.length > 0 ? 'Immediate evacuation is recommended.' : 'Situation under close monitoring.'}`
    : `All zones within acceptable risk parameters. Highest risk: ${worst.zoneName} at ${worst.riskScore}%. No immediate action required.`;

  return { summary, steps };
}

const stepColors = {
  input: { dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/5' },
  analysis: { dot: 'bg-warning', text: 'text-warning', bg: 'bg-warning/5' },
  decision: { dot: 'bg-destructive', text: 'text-destructive', bg: 'bg-destructive/5' },
};

const AIReasoningPanel = ({ predictions, evacuation, pipelineRunCount }: AIReasoningPanelProps) => {
  const [expanded, setExpanded] = useState(true);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const { summary, steps } = generateReasoning(predictions, evacuation);

  // Animate steps appearing one by one on each pipeline run
  useEffect(() => {
    setVisibleSteps(0);
    steps.forEach((_, i) => {
      setTimeout(() => setVisibleSteps(i + 1), (i + 1) * 400);
    });
  }, [pipelineRunCount, steps.length]);

  return (
    <motion.div layout className="glass-card p-4 glow-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 mb-2"
      >
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Reasoning</h3>
        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        <span className="ml-auto">
          {expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Summary */}
            <motion.div
              key={`summary-${pipelineRunCount}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs leading-relaxed text-foreground/80 mb-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10"
            >
              <span className="text-primary font-mono text-[10px]">AI →</span> {summary}
            </motion.div>

            {/* Steps */}
            <div className="space-y-1.5">
              {steps.slice(0, visibleSteps).map((step, i) => {
                const colors = stepColors[step.type];
                return (
                  <motion.div
                    key={`${i}-${pipelineRunCount}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-2 rounded-lg ${colors.bg} border border-transparent`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${colors.text}`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed ml-3.5">{step.detail}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIReasoningPanel;
