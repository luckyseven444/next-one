export async function POST(req) {
    try {
      const { cart } = await req.json();
  
      // Simulate backend processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Fake success response
      return Response.json({ message: "Checkout successful!" }, { status: 200 });
    } catch (error) {
      return Response.json({ message: "Checkout failed" }, { status: 500 });
    }
  }
  