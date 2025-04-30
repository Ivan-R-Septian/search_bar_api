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

    // Jika respons dari webhook tidak valid (misal token salah)
    if (!response.ok) {
      throw new Error("Invalid token or authentication failed");
    }

    const result = await response.json();

    const rawData = result?.data?.value;

    // Variable untuk error jika token salah
    const errorMessage = "Full authentication is required to access this resource";

    // Cek jika data ada atau tidak
    const transformed = {
      message: "success", // Pesan tetap success
      data: rawData?.data?.length > 0
        ? rawData.data.map((item) => ({
            brand: item.brand,
            model: item.model,
            price: item.price,
            installment: item.installment,
            totalDP: item.totalDP,
            promo: item.promo
          }))
        : [] // Jika data kosong, tetap kirimkan array kosong
    };

    // Jika data kosong dan token tidak valid, kirimkan pesan error
    if (transformed.data.length === 0 && !authHeader) {
      transformed.data = [errorMessage];
    }

    res.status(200).json(transformed);

  } catch (error) {
    // Menangani error jika ada masalah dengan token atau lain-lain
    res.status(500).json({ message: "error", error: error.toString() });
  }
}
