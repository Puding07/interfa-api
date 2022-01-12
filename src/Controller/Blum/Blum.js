const fs = require("fs");
const { Readable } = require("stream");
const { PDFDocument } = require("pdf-lib");

async function mergePDFDocuments(documents) {
  const mergedPdf = await PDFDocument.create();

  for (let document of documents) {
    document = await PDFDocument.load(document);

    const copiedPages = await mergedPdf.copyPages(
      document,
      document.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save({ useObjectStreams: true });
}

exports.pdf = (req, res) => {
  const name = req.query.page;
  const page = `${__dirname}/assets/${name}.pdf`;
  var file = fs.readFileSync(page).buffer;

  res.setHeader("Content-Type", "application/pdf");

  if (!Number(Number(name) % 2)) {
    const page2 = `${__dirname}/assets/${Number(name) + 1}.pdf`;
    var file2 = fs.readFileSync(page2).buffer;
    const readable = new Readable();

    readable._read = () => {}; // _read is required but you can noop it

    mergePDFDocuments([file, file2]).then((data) => {
      readable.push(data);
      readable.push(null);
      readable.pipe(res);
    });
  } else {
    // For download
    //var stat = fs.statSync(page);
    //res.setHeader("Content-Length", stat.size);
    //res.setHeader("Content-Disposition", `attachment; filename=${name}.pdf`);
    file.pipe(res);
  }
};
