"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ModelCatalog from "./components/ModelCatalog";
import ModelDetailPanel from "./components/Modeldetailpanel";
import ScenarioBuilder from "./components/Scenariobuilder";
import RunPanel from "./components/Runpanel";
import ResultViewer from "./components/Resultviewer";
import ExplainabilityPanel from "./components/Explainabilitypanel";
import ModelComparison from "./components/Modelcomparison";
import ScheduledRunsManager from "./components/Scheduledrunsmanager";
import ExportSchedulePanel from "./components/Exportschedulepanel";
import LoadingState from "./components/Loadingstate";

import {
  getMockModelsList,
  getMockModelDetail,
  getMockScenarioPresets,
  getMockJobStatus,
  getMockJobResult,
  getMockScheduledRuns,
} from "@/lib/forecasting-mock-data";

import type {
  ModelCatalogItem,
  ModelDetail,
  ScenarioPreset,
  ScenarioParameters,
  ForecastJob,
  ForecastResult,
} from "@/types/forecasting";

export default function ForecastingModelsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Models
  const [models, setModels] = useState<ModelCatalogItem[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [modelDetail, setModelDetail] = useState<ModelDetail | null>(null);
  
  // Scenarios
  const [scenarioPresets, setScenarioPresets] = useState<ScenarioPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>("preset-002");
  const [scenarioParams, setScenarioParams] = useState<ScenarioParameters>({
    horizon: 10,
    investmentMultiplier: 1.0,
    adoptionFactor: 1.0,
    regulatoryShock: 0.0,
  });
  
  // Run State
  const [selectedTechs, setSelectedTechs] = useState<string[]>(["tech-001"]);
  const [currentJob, setCurrentJob] = useState<ForecastJob | null>(null);
  const [results, setResults] = useState<ForecastResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Comparison
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedModels, setComparedModels] = useState<string[]>([]);
  
  // View State
  const [activeView, setActiveView] = useState<"catalog" | "detail" | "results">("catalog");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        const modelsData = getMockModelsList();
        const presetsData = getMockScenarioPresets();
        
        setModels(modelsData.models);
        setScenarioPresets(presetsData);
        
        // Auto-select first published model
        const defaultModel = modelsData.models.find(m => m.isPublished);
        if (defaultModel) {
          setSelectedModelId(defaultModel.id);
        }
      } catch (error) {
        console.error("Error loading forecasting data:", error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Load model detail when selected
  useEffect(() => {
    if (selectedModelId) {
      const detail = getMockModelDetail(selectedModelId);
      setModelDetail(detail.model);
    }
  }, [selectedModelId]);

  // Load scenario preset
  useEffect(() => {
    if (selectedPreset) {
      const preset = scenarioPresets.find(p => p.id === selectedPreset);
      if (preset) {
        setScenarioParams(preset.parameters);
      }
    }
  }, [selectedPreset, scenarioPresets]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setActiveView("detail");
  };

  const handleRunForecast = async () => {
    if (!selectedModelId) return;
    
    setIsRunning(true);
    setActiveView("results");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate job status updates
    const jobStatus = getMockJobStatus("job-12345");
    setCurrentJob(jobStatus.job);
    
    // Simulate completion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const jobResults = getMockJobResult("job-12345");
    setResults(jobResults.results);
    setIsRunning(false);
  };

  const handleCompareModels = (modelIds: string[]) => {
    setComparedModels(modelIds);
    setComparisonMode(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Back to Dashboard</span>
              <span className="xs:hidden">Back</span>
            </button>

            {/* View Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView("catalog")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  activeView === "catalog"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Models
              </button>
              <button
                onClick={() => setActiveView("detail")}
                disabled={!selectedModelId}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  activeView === "detail"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                Configure
              </button>
              <button
                onClick={() => setActiveView("results")}
                disabled={results.length === 0}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  activeView === "results"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Catalog View */}
        {activeView === "catalog" && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Forecasting & Models
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Run and inspect forecasting models to produce scenario outcomes with full governance and explainability
              </p>
            </div>

            <ModelCatalog
              models={models}
              selectedModelId={selectedModelId}
              onSelectModel={handleModelSelect}
              onCompareModels={handleCompareModels}
            />

            <ScheduledRunsManager />
          </div>
        )}

        {/* Detail/Configuration View */}
        {activeView === "detail" && modelDetail && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Model Detail */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <ModelDetailPanel model={modelDetail} />
            </div>

            {/* Right Column - Configuration & Run */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <ScenarioBuilder
                presets={scenarioPresets}
                selectedPreset={selectedPreset}
                parameters={scenarioParams}
                onPresetChange={setSelectedPreset}
                onParametersChange={setScenarioParams}
              />

              <RunPanel
                selectedModel={modelDetail}
                selectedTechs={selectedTechs}
                scenario={selectedPreset || "custom"}
                parameters={scenarioParams}
                isRunning={isRunning}
                currentJob={currentJob}
                onRun={handleRunForecast}
                onTechsChange={setSelectedTechs}
              />
            </div>
          </div>
        )}

        {/* Results View */}
        {activeView === "results" && (
          <div className="space-y-4 sm:space-y-6">
            {comparisonMode && comparedModels.length > 1 ? (
              <ModelComparison
                techId={selectedTechs[0]}
                modelIds={comparedModels}
                onClose={() => setComparisonMode(false)}
              />
            ) : results.length > 0 ? (
              <>
                <ResultViewer
                  results={results}
                  isLoading={isRunning}
                />

                {results.length > 0 && (
                  <>
                    <ExplainabilityPanel
                      explainability={results[0].explainability}
                      influencingSources={results[0].topInfluencingSources}
                    />

                    <ExportSchedulePanel
                      jobId={currentJob?.id || ""}
                      results={results}
                    />
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    No results yet. Configure and run a forecast to see predictions.
                  </p>
                  <button
                    onClick={() => setActiveView("detail")}
                    className="text-primary hover:underline"
                  >
                    Go to Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}