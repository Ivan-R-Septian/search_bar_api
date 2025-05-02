export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Tangani preflight (OPTIONS) agar tidak error
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Lanjut ke handler kamu
  const webhookUrl = "https://generative.3dolphins.ai:9443/dolphin/apiv1/graph/workflow/8d69eb3022b76f955740c336a18f66a4/WF/node-1744633504830/webhook";
  const authHeader = req.headers['authorization'] || '';

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error("Invalid token or authentication failed");
    }

    const result = await response.json();
    const rawData = result?.data?.value;

    const transformed = {
      message: "success",
      data: rawData?.data?.length > 0
        ? rawData.data.map((item) => ({
            brand: item.brand,
            model: item.model,
            price: item.price,
            installment: item.installment,
            totalDP: item.totalDP,
            promo: item.promo,
            failed: item.failed
          }))
        : []
    };

    if (transformed.data.length === 0 && !authHeader) {
      transformed.data = ["Full authentication is required to access this resource"];
    }

    res.status(200).json(transformed);

  } catch (error) {
    res.status(500).json({ message: "error", error: error.toString() });
  }
}
