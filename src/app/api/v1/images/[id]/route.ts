import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase.from("user_images").select().eq("id", id.trim()).single();
    if (error) return NextResponse.json({ data: null, error: error.message, statusText: "FAIL" });

    const { data: blob, error: err } = await supabase.storage
      .from("user-images")
      .download(data.file_path);
    if (err) return NextResponse.json({ data: null, error: err.message, statusText: "FAIL" });
    
    data.image = blob

    return NextResponse.json({data, error: null, statusText: "OK"})
}

