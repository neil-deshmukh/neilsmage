import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("user_images").select()
    if (error) {
        return NextResponse.json({data: null, error: "Was not able to fetch images", statusText: "FAIL"})
    }
    return NextResponse.json({data, error: null, statusText: "OK"})
}

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const body = await req.formData()

    const file = body.get("file") as File
    if (!file) return NextResponse.json({ data: null, error: "Did not recieve file", statusText: "FAIL" })
    
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("user-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    
    const newImage = {
      user_id: userId,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    };

    const { data, error: err } = await supabase.from("user_images").insert(newImage).select()

    if (error) return NextResponse.json({ data: null, error: error.message, statusText: "FAIL" })
    if (err) return NextResponse.json({ data: null, error: err.message, statusText: "FAIL" })
    
    return NextResponse.json({data: data[0], error: null, statusText: "OK"})
}