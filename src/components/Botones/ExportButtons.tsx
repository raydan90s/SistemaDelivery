import React, { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  File,
} from "lucide-react";
import { useReport, type ExportFormat } from "@hooks/useReport";

interface ReportColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => string | number;
}

interface ExportButtonsProps {
  title: string;
  subtitle?: string;
  filename: string;
  columns: ReportColumn[];
  data: any[];
  className?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  title,
  subtitle,
  filename,
  columns,
  data,
  className = "",
}) => {
  const { generateReport, exporting } = useReport();
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    await generateReport(
      {
        title,
        subtitle,
        filename: `${filename}_${new Date().toISOString().split("T")[0]}`,
        columns,
        data,
      },
      format,
    );
    setShowMenu(false);
  };

  const exportOptions = [
    {
      format: "pdf" as ExportFormat,
      label: "PDF",
      icon: FileText,
      color: "text-red-600",
    },
    {
      format: "excel" as ExportFormat,
      label: "Excel",
      icon: FileSpreadsheet,
      color: "text-green-600",
    },
    {
      format: "csv" as ExportFormat,
      label: "CSV",
      icon: FileSpreadsheet,
      color: "text-blue-600",
    },
    {
      format: "json" as ExportFormat,
      label: "JSON",
      icon: FileJson,
      color: "text-yellow-600",
    },
    {
      format: "txt" as ExportFormat,
      label: "TXT",
      icon: File,
      color: "text-gray-600",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        {exporting ? 'Exportando...' : 'Exportar'}
        
      </button>

      {showMenu && !exporting && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                >
                  <Icon className={`w-5 h-5 ${option.color}`} />
                  <span className="text-gray-700 font-medium">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButtons;
