export default async function handler(req, res) {
  const webhookUrl = "https://generative.3dolphins.ai:9443/dolphin/apiv1/graph/workflow/8d69eb3022b76f955740c336a18f66a4/WF/node-1744633504830/webhook";

  const authHeader = req.headers['authorization'] || ''; // Ambil header, kalau nggak ada tetap kirim kosong

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(req.body),
    });

    // Jika status bukan 200, berarti ada masalah pada authentication atau request
    if (!response.ok) {
      return res.status(200).json({
        message: "Full authentication is required to access this resource",
        data: []
      });
    }

    const result = await response.json();

    // Cek apakah data ada, jika tidak kirimkan response error juga
    const rawData = result?.data?.value;

    if (!rawData) {
      return res.status(200).json({
        message: "Full authentication is required to access this resource",
        data: []
      });
    }

    // Jika data ditemukan, lakukan pemetaan data seperti yang diminta
    const transformed = {
      message: rawData?.message || "success",
      data: rawData?.data?.map((item) => ({
        brand: item.brand,
        model: item.model,
        price: item.price,
        installment: item.installment,
        totalDP: item.totalDP,
        promo: item.promo
      })) || [] // Jika tidak ada data, kosongkan array
    };

    res.status(200).json(transformed);

  } catch (error) {
    res.status(500).json({ message: "error", error: error.toString() });
  }
}
