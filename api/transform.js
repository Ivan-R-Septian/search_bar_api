export default async function handler(req, res) {
  // Ambil data dari webhook
  const webhookUrl = "https://generative.3dolphins.ai:9443/dolphin/apiv1/graph/workflow/8d69eb3022b76f955740c336a18f66a4/WF/node-1744633504830/webhook";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // forward user request
    });

    const result = await response.json();

    // Ambil value.data dari response webhook
    const rawData = result?.data?.value;

    const transformed = {
      message: rawData?.message || "success",
      data: rawData?.data?.map((item) => ({
        brand: item.brand,
        model: item.model,
        price: item.price,
        installment: item.installment,
        totalDP: item.totalDP,
        promo: item.promo
      })) || []
    };

    res.status(200).json(transformed);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
}
