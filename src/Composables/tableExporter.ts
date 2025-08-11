import { useToast } from 'vue-toastification';
import axios from 'axios';

export class TableExporter {
  static print(tableId: string): boolean {
    const toast = useToast();
    const wd = window.open('', 'PRINT', 'height=400,width=600');
    if (!wd) return false;

    wd.document.write('<html><head><title>Print Table</title>');
    wd.document.write('<link href="/css/main.css" rel="stylesheet"/>');
    wd.document.write('<style>@media print{.vgt-header, #datatable-header, #pagination, .dropdown {display: none;}}</style>');
    wd.document.write('</head><body>');

    const tableElement = document.getElementById(tableId);
    if (tableElement) {
      wd.document.write(tableElement.innerHTML);
    } else {
      wd.document.write('<p>Table not found</p>');
    }

    wd.document.write('</body></html>');
    wd.document.close();
    wd.focus();
    wd.print();
    setTimeout(() => wd.close(), 2000);

    return true;
  }

  static async downloadData(url: string, serverParams: any, pageName: string): Promise<void> {
    try {
      const params = { ...serverParams, download: 1 };
      const response = await axios.get(url, {
        params: params,
        responseType: 'blob'
      });

      this.resolveAndDownloadBlob(response, pageName, serverParams);
    } catch (error: any) {
      await this.handleDownloadError(error);
    }
  }

  private static resolveAndDownloadBlob(response: any, pageName: string, serverParams: any): void {
    if (['Customers', 'states_sales', 'state_sales'].includes(pageName)) {
      new Blob([response.data]).text().then(r => {
        const toast = useToast();
        toast.success("Exporting data! " + JSON.parse(r));
      });
      return;
    }

    let filename = pageName;
    const dateName = this.generateDateName(serverParams.from_date, serverParams.to_date);
    if (dateName) filename += `_${dateName}`;
    filename += `.xlsx`;
    filename = decodeURI(filename);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.target = "__blank";
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  private static async handleDownloadError(error: any): Promise<void> {
    const toast = useToast();
    try {
      const text = await new Blob([error.response.data]).text();
      const errorMessage = JSON.parse(text).error;
      toast.error("Error downloading data! " + errorMessage);
    } catch {
      toast.error("Error downloading data!");
    }
  }

  private static generateDateName(fromDate?: string, toDate?: string): string {
    let datename = "";

    if (fromDate) {
      const fdate = new Date(fromDate);
      datename += fdate.toLocaleDateString('en-GB').replace(/\//g, '-');
    }

    if (toDate) {
      const tdate = new Date(toDate);
      datename += `_${tdate.toLocaleDateString('en-GB').replace(/\//g, '-')}`;
    }

    return datename;
  }

  static onError(err: any): string {
    const errorData = err.response?.data;
    if (!errorData) return 'An unexpected error occurred.';

    if (Array.isArray(errorData.error)) {
      return errorData.error.join(', ');
    }

    return errorData.error || errorData.message || 'Unknown error';
  }
}
