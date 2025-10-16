import { createAdmin } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createAdmin()
  const { id } = await params

  const { data, error } = await supabase.from("user_images").select().eq("id", id.trim()).single();
  if (error) return NextResponse.json({ data: null, error: error.message }, {status: 404});

  const { data: urlobj, error: err } = await supabase.storage
    .from("user-images")
    .createSignedUrl(data.file_path, 4000)
  if (err) return NextResponse.json({ data: null, error: err.message }, {status: 500});
  
  data.url = urlobj.signedUrl

  return NextResponse.json({data, error: null}, {status: 200})
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createAdmin()
  const { id } = await params
  const { data, error } = await supabase.from("user_images").delete().eq("id", id.trim()).select()
  if (error) return NextResponse.json({error: error.message}, {status: 404})
  await supabase.storage.from("user-images").remove([data[0].file_path]);
  return NextResponse.json({error: null}, {status: 200})
}