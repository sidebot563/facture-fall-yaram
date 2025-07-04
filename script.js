  function calculerTotal() {
    let totalHT = 0;
    document.querySelectorAll("#services tbody tr").forEach(row => {
      let qte = row.cells[1].querySelector("input").value;
      let prix = row.cells[2].querySelector("input").value;
      let total = parseInt(qte || 0) * parseInt(prix || 0);
      row.cells[3].innerText = total;
      totalHT += total;
    });
    const tva = Math.round(totalHT * 0.18);
    document.getElementById("totalHT").innerText = totalHT;
    document.getElementById("ttc").innerText = totalHT + tva;
  }

  function ajouterLigne() {
    const tbody = document.querySelector("#services tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" /></td>
      <td><input type="number" value="1" onchange="calculerTotal()" /></td>
      <td><input type="number" value="0" onchange="calculerTotal()" /></td>
      <td class="total">0</td>
      <td><button class="btn" onclick="supprimerLigne(this)">✖</button></td>`;
    tbody.appendChild(tr);
  }

  function supprimerLigne(btn) {
    btn.closest("tr").remove();
    calculerTotal();
  }

   document.getElementById('genererPdf').addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;
      const element = document.getElementById('facture');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('facture-fall-yaram.pdf');
    });
 function genererPDF() {
  const factureElement = document.getElementById('facture');

  // Cloner l'élément pour le modifier sans toucher l'original
  const clone = factureElement.cloneNode(true);

  // Supprimer tous les boutons du clone
  const boutons = clone.querySelectorAll('button');
  boutons.forEach(btn => btn.remove());

  // Options pour html2pdf
  const opt = {
    margin: 0,
    filename: 'facture_fall_yaram.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  // Création d'un conteneur temporaire hors écran pour le PDF
  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.top = '-10000px';
  hiddenContainer.appendChild(clone);
  document.body.appendChild(hiddenContainer);

  html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(hiddenContainer);
  });
}