import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'txt';

interface ReportColumn {
  key: string;
  label: string;
  render?: (value: any, item: any) => string | number;
}

interface ReportConfig {
  title: string;
  subtitle?: string;
  filename: string;
  columns: ReportColumn[];
  data: any[];
}

export const useReport = () => {
  const [exporting, setExporting] = useState(false);

  const generateReport = async (
    config: ReportConfig,
    format: ExportFormat
  ) => {
    setExporting(true);
    
    try {
      switch (format) {
        case 'pdf':
          await exportPDF(config);
          break;
        case 'excel':
          exportExcel(config);
          break;
        case 'csv':
          exportCSV(config);
          break;
        case 'json':
          exportJSON(config);
          break;
        case 'txt':
          exportTXT(config);
          break;
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = async (config: ReportConfig) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Función para dibujar encabezado en cada página
    const drawHeader = () => {
      // Fondo del encabezado con gradiente simulado
      doc.setFillColor(239, 68, 68); // Color rojo principal
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Línea decorativa dorada
      doc.setDrawColor(251, 191, 36);
      doc.setLineWidth(1.5);
      doc.line(10, 43, pageWidth - 10, 43);
      
      // Logo/Nombre de la empresa
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('FoodExpress', pageWidth / 2, 20, { align: 'center' });
      
      // Slogan
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text('Deliciosa comida a tu puerta', pageWidth / 2, 32, { align: 'center' });
    };
    
    // Función para dibujar pie de página
    const drawFooter = (pageNum: number, totalPages: number) => {
      // Línea decorativa superior
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
      
      // Información del pie
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // Fecha y hora en la esquina izquierda
      const fecha = new Date().toLocaleString('es-EC', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
      doc.text(`Generado: ${fecha}`, 15, pageHeight - 12);
      
      // Paginación en el centro
      doc.setFont('helvetica', 'bold');
      doc.text(
        `Página ${pageNum} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 12,
        { align: 'center' }
      );
      
      // Copyright en la esquina derecha
      doc.setFont('helvetica', 'italic');
      doc.text('© FoodExpress 2025', pageWidth - 15, pageHeight - 12, { align: 'right' });
    };
    
    // Dibujar encabezado inicial
    drawHeader();
    
    // Título del reporte
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(config.title, pageWidth / 2, 55, { align: 'center' });
    
    // Subtítulo si existe
    let startY = 62;
    if (config.subtitle) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(config.subtitle, pageWidth / 2, 62, { align: 'center' });
      startY = 69;
    }
    
    // Información adicional
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    const fecha = new Date().toLocaleString('es-EC', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
    doc.text(`Fecha de emisión: ${fecha}`, pageWidth / 2, startY, { align: 'center' });
    doc.text(`Total de registros: ${config.data.length}`, pageWidth / 2, startY + 5, { align: 'center' });
    
    // Preparar datos para la tabla
    const headers = config.columns.map(col => col.label);
    const rows = config.data.map(item => 
      config.columns.map(col => {
        if (col.render) {
          return col.render(item[col.key], item);
        }
        return item[col.key] ?? '';
      })
    );
    
    // Tabla con diseño mejorado
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: startY + 12,
      theme: 'striped',
      headStyles: {
        fillColor: [220, 38, 38], // Rojo FoodExpress
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 10,
        cellPadding: 4,
        lineWidth: 0.1,
        lineColor: [239, 68, 68]
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [229, 231, 235],
        textColor: [31, 41, 55]
      },
      alternateRowStyles: {
        fillColor: [254, 242, 242] // Rosa muy claro
      },
      columnStyles: {
        0: { halign: 'center', fontStyle: 'bold' } // Primera columna (ID) centrada y en negrita
      },
      margin: { top: 50, bottom: 25, left: 10, right: 10 },
      didDrawPage: (data) => {
        // Redibujar encabezado y pie en cada página
        if (data.pageNumber > 1) {
          drawHeader();
        }
      }
    });
    
    // Dibujar pies de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawFooter(i, pageCount);
    }
    
    doc.save(`${config.filename}.pdf`);
  };

  const exportExcel = (config: ReportConfig) => {
    const headers = config.columns.map(col => col.label);
    const rows = config.data.map(item => 
      config.columns.map(col => {
        if (col.render) {
          return col.render(item[col.key], item);
        }
        return item[col.key] ?? '';
      })
    );
    
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['FoodExpress'],
      ['Deliciosa comida a tu puerta'],
      [],
      [config.title],
      config.subtitle ? [config.subtitle] : [],
      [`Generado: ${new Date().toLocaleString('es-EC')}`],
      [`Total de registros: ${config.data.length}`],
      [],
      headers,
      ...rows,
      [],
      ['© FoodExpress 2025']
    ]);
    
    // Ajustar ancho de columnas
    const colWidths = config.columns.map(() => ({ wch: 20 }));
    worksheet['!cols'] = colWidths;
    
    // Estilo para la cabecera de la empresa (fila 1)
    worksheet['A1'].s = {
      font: { bold: true, sz: 18, color: { rgb: "DC2626" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
    
    // Estilo para el slogan (fila 2)
    worksheet['A2'].s = {
      font: { italic: true, sz: 12, color: { rgb: "6B7280" } },
      alignment: { horizontal: "center" }
    };
    
    // Estilo para el título del reporte (fila 4)
    worksheet['A4'].s = {
      font: { bold: true, sz: 14, color: { rgb: "1F2937" } },
      alignment: { horizontal: "center" }
    };
    
    // Estilo para encabezados de columnas
    const headerRow = config.subtitle ? 9 : 8;
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + headerRow;
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "DC2626" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    XLSX.writeFile(workbook, `${config.filename}.xlsx`);
  };

  const exportCSV = (config: ReportConfig) => {
    const headers = config.columns.map(col => col.label).join(',');
    const rows = config.data.map(item =>
      config.columns.map(col => {
        let value = col.render 
          ? col.render(item[col.key], item)
          : item[col.key] ?? '';
        
        // Escapar comas y comillas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ).join('\n');
    
    const csv = `FoodExpress - Deliciosa comida a tu puerta\n${config.title}\n${config.subtitle || ''}\nGenerado: ${new Date().toLocaleString('es-EC')}\nTotal de registros: ${config.data.length}\n\n${headers}\n${rows}\n\n© FoodExpress 2025`;
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.filename}.csv`;
    link.click();
  };

  const exportJSON = (config: ReportConfig) => {
    const exportData = {
      company: {
        name: 'FoodExpress',
        slogan: 'Deliciosa comida a tu puerta',
        copyright: '© FoodExpress 2025'
      },
      metadata: {
        title: config.title,
        subtitle: config.subtitle,
        generatedAt: new Date().toISOString(),
        totalRecords: config.data.length
      },
      data: config.data.map(item => {
        const obj: any = {};
        config.columns.forEach(col => {
          obj[col.key] = col.render 
            ? col.render(item[col.key], item)
            : item[col.key];
        });
        return obj;
      })
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.filename}.json`;
    link.click();
  };

  const exportTXT = (config: ReportConfig) => {
    let txt = '';
    txt += '═'.repeat(80) + '\n';
    txt += 'FOODEXPRESS\n';
    txt += 'Deliciosa comida a tu puerta\n';
    txt += '═'.repeat(80) + '\n\n';
    
    txt += `${config.title}\n`;
    txt += '─'.repeat(config.title.length) + '\n';
    
    if (config.subtitle) {
      txt += `${config.subtitle}\n`;
      txt += '─'.repeat(config.subtitle.length) + '\n';
    }
    
    txt += `\nGenerado: ${new Date().toLocaleString('es-EC')}\n`;
    txt += `Total de registros: ${config.data.length}\n\n`;
    txt += '─'.repeat(80) + '\n\n';
    
    config.data.forEach((item, index) => {
      txt += `┌─ Registro #${index + 1}\n`;
      config.columns.forEach(col => {
        const value = col.render 
          ? col.render(item[col.key], item)
          : item[col.key] ?? 'N/A';
        txt += `│ ${col.label}: ${value}\n`;
      });
      txt += '└' + '─'.repeat(78) + '\n\n';
    });
    
    txt += '═'.repeat(80) + '\n';
    txt += '© FoodExpress 2025 - Todos los derechos reservados\n';
    txt += '═'.repeat(80) + '\n';
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.filename}.txt`;
    link.click();
  };

  return { generateReport, exporting };
};