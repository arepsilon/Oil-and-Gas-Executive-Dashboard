import HeaderSection from "@/components/HeaderSection";
import ProductionOverview from "@/components/ProductionOverview";
import FinancialPerformance from "@/components/FinancialPerformance";
import AssetPortfolioRisk from "@/components/AssetPortfolioRisk";
import AFECapexTracking from "@/components/AFECapexTracking";
import FilterBar from "@/components/FilterBar";


export default function Home() {
  return (
    <main className="h-screen w-screen bg-zinc-50 p-4 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 space-y-2">

        {/* Dashboard Title */}
        <div className="flex justify-between items-center px-1">
          <img src="/logo.png" alt="DG Petro" className="h-12 object-contain" />
          <div className="text-right">
            <h2 className="text-lg font-medium text-brand-gold tracking-wide">Leadership Command Centre</h2>
            <p className="text-[10px] text-zinc-400">Data as of: Dec 8, 2024 • 11:30 PM CST</p>
          </div>
        </div>

        {/* Global Filters */}
        <FilterBar />

        {/* Header Section */}
        <HeaderSection />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Section 1: Production Overview (Left) */}
          <div className="col-span-3 h-full overflow-hidden">
            <ProductionOverview />
          </div>

          {/* Section 2: Financial Performance (Middle) */}
          <div className="col-span-3 h-full overflow-hidden">
            <FinancialPerformance />
          </div>

          {/* Section 3: Asset Portfolio & Risk (Right) */}
          <div className="col-span-3 h-full overflow-hidden">
            <AssetPortfolioRisk />
          </div>

          {/* Section 4: AFE & Capex Tracking */}
          <div className="col-span-3 h-full overflow-hidden">
            <AFECapexTracking />
          </div>
        </div>
      </div>
    </main>
  );
}
