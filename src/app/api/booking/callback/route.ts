// import { Browser, BrowserContext, chromium, Page } from "playwright";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(
  request: Request,
) {
  const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  // let browser = await chromium.launch({ headless: true });
  // let context = await browser.newContext();
  // let page = await context.newPage();

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(
    `https://www.gadjahfest.com/invoice/T85SS9CY78`,
    {
      waitUntil: "networkidle0",
    },
  );

  const buffer = await page.pdf({ format: "a4" });

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `raflyanandas.pdf`,
    Body: buffer,
    ContentType: "application/pdf",
  };

  await s3Client.send(new PutObjectCommand(s3Params));

  return NextResponse.json({ message: "ok" });
}
