import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import PresentService from "../../components/PresentService";
import TitleBlock from "../../components/TitleBlock";

function AllTools() {
  return (
    <>
      <Header />

      <div
        className="text-center"
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          padding: "140px 0 110px 0",
        }}
      >
        <Container>
          <h1 className="font-black text-[30px] sm:text-[48px] mb-6">
            Edit Smarter
            <br />
            Create Faster
          </h1>
          <p className="max-w-[800px] mx-auto">
            Pick a tool below and start editing instantly — no experience needed
          </p>
        </Container>
      </div>

      <div
        style={{
          backgroundColor: "var(--primary-section-color)",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <TitleBlock
            subtitle={"SEAMLESS BACKGROUNDS"}
            title="BACKGROUND TOOLS"
            description="Quickly remove, replace, or clean image backgrounds with reliable AI for flawless cutouts and realistic scene rebuilding. Perfect for product shots, portraits, and social posts — fast, precise, and natural-looking results"
          />

          <div className="mt-10">
            <PresentService
              isTextFirst={true}
              before="/images/remove-bg-3.png"
              after="/images/remove-bg-4.png"
              aspectRatio="12/8"
              fit="fill"
              category="BACKGROUND TOOLS"
              title="Remove Backgrounds Instantly"
              description="Upload your image and let our smart tool do the work. Whether you're editing product photos or creating social media content, our background remover helps you isolate your subject with precision and speed. No manual cropping—just fast, clean results."
              linkTo="/remove-background"
              innerLinkText="Try it now for free"
            />
          </div>

          <div className="mt-20">
            <PresentService
              isTextFirst={false}
              before="/images/remove-object-2.png"
              after="/images/remove-object-3.png"
              aspectRatio="12/8"
              fit="fill"
              category="BACKGROUND TOOLS"
              title="Remove Unwanted Objects"
              description="Clean up your photos in seconds with our smart AI object remover. Whether it's a stray person, a distracting item, or background clutter—just highlight it and let the magic happen. Your image stays flawless, your focus stays sharp."
              linkTo="/object-removal"
              innerLinkText="Try it now for free"
            />
          </div>

          {/* <div className="mt-20">
            <PresentService
              isTextFirst={true}
              before="/images/change-bg-5.jpg"
              after="/images/change-bg-6.png"
              aspectRatio="12/8"
              fit="fill"
              category="BACKGROUND TOOLS"
              title="Change Background"
              description="Replace the original backdrop with preset scenes, gradients, or a custom upload while keeping lighting and perspective coherent. The tool offers match-color and shadow adjustments so the new background integrates naturally with the subject. You can choose stylized backdrops (blurred studio, solid color, scenic) or upload a brand image for consistent product shots. Auto-alignment and scale help place the subject correctly, and quick previews let you cycle through options instantly. Great for ecommerce product photos, profile images, and marketing visuals."
              linkTo="/change-background"
              innerLinkText="Try it Now"
            />
          </div>} */}
        </Container>
      </div>

      <div
        style={{
          backgroundColor: "var(--secondary-section-color)",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <TitleBlock
            subtitle={"PROFESSIONAL ENHANCEMENTS"}
            title="ENHANCE & CLEANUP"
            description="Speed up your workflow with smart enhancement and cleanup tools that make images look polished and professional. From one-click fixes to fine-grained control, these tools remove noise, boost details, and restore clarity while keeping results natural"
          />

          <div className="mt-10">
            <PresentService
              isTextFirst={true}
              before="/images/ai-image-enhancer-3.png"
              after="/images/ai-image-enhancer-4.jpg"
              aspectRatio="12/8"
              fit="fill"
              category="ENHANCE & CLEANUP"
              title="AI Image Enhancer"
              description="Instantly improve overall image quality using AI-driven adjustments for exposure, color balance, contrast, and detail. The tool analyzes the photo and applies context-aware corrections that preserve natural skin tones and textures. It reduces noise, refines highlights and shadows, and brings out subtle details without over-processing. Users can toggle strength levels (Auto / Mild / Intense) and preview changes in real time. Ideal for quick polishing of portraits, product shots, and social assets."
              linkTo="/ai-image-enhancer"
              innerLinkText="Try it Now"
            />
          </div>

          <div className="mt-20">
            <PresentService
              isTextFirst={false}
              before="/images/sharp.png"
              after="/images/sharp-2.jpg"
              aspectRatio="12/8"
              fit="fill"
              category="ENHANCE & CLEANUP"
              title="Sharpen Image"
              description="Boost perceived clarity by enhancing edge definition and micro-contrast while avoiding unwanted halos. The algorithm selectively targets soft areas like eyes, hair, and textures to create crisp, camera-ready results. Adjustable sliders let users control Amount, Radius, and Threshold for precise tuning. Works well in combination with the Enhancer for final refinement and is safe to apply in small increments to avoid noise amplification. Perfect for rescuing slightly soft or slightly out-of-focus photos."
              linkTo="/sharpen-image"
              innerLinkText="Try it Now"
            />
          </div>

          {/* <div className="mt-20">
            <PresentService
              isTextFirst={true}
              before="/images/clean.jpg"
              after="/images/clean-2.png"
              aspectRatio="12/8"
              fit="fill"
              category="ENHANCE & CLEANUP"
              title="Cleanup Pictures"
              description="Remove dust, spots, sensor noise, and small blemishes automatically with intelligent spot-healing and noise reduction. The tool scans the image for common imperfections and offers both auto-fix and brush-based manual corrections for fine control. It also includes a smart clone/patch option that reconstructs complex textures so repairs look seamless. Users can zoom into areas, apply fixes, and rollback individual edits from history. Best for restoring scanned photos, product images, or any shot with distracting artifacts."
              linkTo="/cleanup-pictures"
              innerLinkText="Try it Now"
            />
          </div> */}
        </Container>
      </div>

      <div
        style={{
          backgroundColor: "var(--primary-section-color)",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <TitleBlock
            subtitle={"CREATIVE TRANSFORMS"}
            title="Artistic Effects & Filters"
            description="Unlock playful and artistic options to reimagine photos with stylized filters, cartoon conversions, and creative layouts. These tools make it easy to generate shareable content, unique assets, and eye-catching visuals for social media or campaigns"
          />

          <div className="mt-10">
            <PresentService
              isTextFirst={false}
              before="/images/to-cartoon-1.png"
              after="/images/to-cartoon-2.jpg"
              aspectRatio="12/8"
              fit="fill"
              category="ARTISTIC EFFECTS & FILTERS"
              title="Photo to Cartoon"
              description="Convert portraits or photos into polished cartoon or illustration styles using neural style transfer tuned for faces and textures. Outputs include multiple style presets (line-art, flat-color, painterly) and adjustable strength for subtle to bold transformations. The tool preserves facial proportions and key details while translating shading and edges into an illustrated look. Users can tweak color palettes and line thickness, then export at high resolution for avatars or social posts. Great for playful branding, profile pics, and viral content."
              linkTo="/photo-to-cartoon"
              innerLinkText="Try it Now"
            />
          </div>

          {
            <div className="mt-20">
              <PresentService
                isTextFirst={true}
                before="/images/filter.png"
                after="/images/filter-2.png"
                aspectRatio="12/8"
                fit="fill"
                category="ARTISTIC EFFECTS & FILTERS"
                title="Photo Filters"
                description="Apply professionally crafted color presets and creative looks to change mood and style instantly. Filters range from subtle cinematic corrections to punchy social-media-ready looks, each preserving skin tones and dynamic range. Each preset includes adjustable intensity so you can blend the filter with the original image for natural results. Save custom combinations as user presets for consistent branding across batches. Great for quick styling, A/B testing looks, and keeping a cohesive aesthetic across your content."
                linkTo="/grayscale-image"
                innerLinkText="Try it Now"
              />
            </div>
          }

          {/* <div className="mt-20">
            <PresentService
              isTextFirst={false}
              before="/images/sticker-1.png"
              after="/images/sticker-2.png"
              aspectRatio="12/8"
              fit="fill"
              category="CREATIVE & FUN"
              title="Sticker Maker"
              description="Turn any edited image or subject into a clean sticker with transparent cutout, optional outline, and export presets for messaging apps or social stories. You can add borders, drop shadows, and simple text labels before exporting sticker sheets or single PNGs. The tool creates balanced padding and snap guides to ensure stickers look good on different backgrounds. Batch mode allows producing multiple stickers from an album automatically. Perfect for creators who want custom assets for reels, stories, or brand kits."
              linkTo="/sticker-maker"
              innerLinkText="Try it Now"
            />
          </div> */}
        </Container>
      </div>

      <div
        style={{
          backgroundColor: "var(--secondary-section-color)",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <TitleBlock
            subtitle={"ESSENTIAL EDITS"}
            title="BASIC EDITS"
            description="Core, quick-edit tools for resizing, framing, and flipping images — simple operations that are essential in every editing workflow. Fast, reliable, and designed to pair seamlessly with the AI-powered features for a complete editing experience"
          />

          <div className="mt-10">
            <PresentService
              isTextFirst={false}
              before="/images/resize.jpg"
              after="/images/resize-2.jpg"
              aspectRatio="12/8"
              fit="fill"
              category="BASIC EDITS"
              title="Resize Image"
              description="Change image dimensions and resolution with smart resampling that minimizes quality loss and preserves important details. Preset aspect ratios and device-targeted sizes (Instagram, TikTok, banners) streamline exports for common use cases. You can choose resample algorithms (bicubic, lanczos) or an AI upscaling option for enlargements. The interface previews final pixel dimensions and file size so you can optimize for web or print. Handy for batch resizing large galleries or preparing single images for specific platforms."
              linkTo="/resize-image"
              innerLinkText="Try it Now"
            />
          </div>

          <div className="mt-20">
            <PresentService
              isTextFirst={true}
              before="/images/crop.jpg"
              after="/images/crop-2.jpg"
              aspectRatio="12/8"
              fit="fill"
              category="BASIC EDITS"
              title="Crop Image"
              description="Recompose photos with precision using freeform crop, preset ratios, and rule-of-thirds guides to improve framing instantly. Auto-suggestions highlight better crops based on subject positioning and visual balance. Edge-aware cropping keeps important areas visible and allows non-destructive crops saved as versions. Quick keyboard shortcuts and snap-to guides speed up iterative adjustments during editing sessions. Ideal for tightening composition for thumbnails, profile pictures, and layout-ready assets."
              linkTo="/crop-image"
              innerLinkText="Try it Now"
            />
          </div>

          <div className="mt-20">
            <PresentService
              isTextFirst={false}
              isStatic={true}
              staticImgSrc="/images/college-6.jpg"
              category="BASIC EDITS"
              title="Collage Maker"
              description="Combine multiple photos into cohesive, well-composed collages using modern templates and flexible grid controls. Drag-and-drop placement, rounded corners, and consistent spacing keep the layout neat while smart cropping preserves important subject areas. Templates include thematic choices (travel, portfolio, product grid) and adjustable aspect ratios for Instagram posts or story formats. Users can add optional frames, subtle shadows, and color-coordinated backgrounds for polish. Excellent for moodboards, social campaigns, and multi-photo storytelling."
              linkTo="/create-collage"
              innerLinkText="Try it Now"
            />
          </div>

          {/*<div className="mt-20">
            <PresentService
              isTextFirst={true}
              before="/images/flip.png"
              after="/images/flip-2.png"
              aspectRatio="12/8"
              fit="fill"
              category="BASIC EDITS"
              title="Flip Image"
              description="Flip images horizontally or vertically to correct orientation or create mirrored variations quickly. Useful for product shots, portraits, or compositional tweaks when symmetry or direction matters. The tool preserves metadata and works nondestructively so original images remain intact. Combine flip with crop or resize steps for rapid asset variations. Lightweight and instant — a simple but indispensable utility in everyday editing."
              linkTo="/flip-image"
              innerLinkText="Try it Now"
            />
          </div>*/}
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default AllTools;
