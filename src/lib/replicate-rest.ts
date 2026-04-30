export async function callReplicate(model: string, input: any) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN is missing");

  // Create prediction
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: model.split(":")[1],
      input: input,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate error: ${err}`);
  }

  let prediction = await createRes.json();

  // Poll for result
  while (prediction.status !== "succeeded" && prediction.status !== "failed") {
    await new Promise(r => setTimeout(r, 1000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { "Authorization": `Token ${token}` },
    });
    prediction = await pollRes.json();
  }

  if (prediction.status === "failed") {
    throw new Error(`Replicate prediction failed: ${prediction.error}`);
  }

  return prediction.output;
}
