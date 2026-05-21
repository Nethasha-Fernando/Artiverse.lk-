import { useArtworkForm }    from "../hooks/useArtworkForm";
import ImageUploader         from "../components/artwork/create/ImageUploader";
import OriginalArtSection    from "../components/artwork/create/OriginalArtSection";
import PrintsSection         from "../components/artwork/create/PrintsSection";
import Input                 from "../components/common/Input";

export default function CreateArtworkPage() {
  const form = useArtworkForm();

  return (
    <div className="max-w-[860px] mx-auto p-5 space-y-4 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold text-gray-800">Add Artwork</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={form.handleSave}
            className="px-4 py-1.5 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={form.handleDiscard}
            className="px-4 py-1.5 text-sm rounded-full bg-pink-100 text-red-500 hover:bg-pink-200 transition font-medium"
          >
            Discard
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {form.submitError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {form.submitError}
        </div>
      )}

      {/* ── Images ── */}
      <ImageUploader
        mainImageUrl={form.form.mainImageUrl}
        supportingImageUrls={form.form.supportingImageUrls}
        mainInputRef={form.mainInputRef}
        suppInputRef={form.suppInputRef}
        onMainFile={form.handleMainFile}
        onRemoveMain={form.removeMain}
        onDrop={form.onDrop}
        onSuppFiles={form.handleSuppFiles}
        onRemoveSupp={form.removeSupp}
      />

      {/* ── Name + Description ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Name of the artwork
          </label>
          <Input
            type="text"
            maxLength={120}
            value={form.form.name}
            error={form.nameError}
            onChange={(e) => form.setField("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Description
            <span className="font-normal text-gray-400 ml-1">(optional)</span>
          </label>
          <textarea
            rows={3}
            maxLength={600}
            value={form.form.description}
            onChange={(e) => form.setField("description", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm
              text-gray-800 outline-none transition focus:ring-1 focus:ring-red-300 resize-y leading-relaxed"
          />
        </div>
      </div>

      {/* ── Original Art ── */}
      <OriginalArtSection
        category={form.form.category}
        originalArt={form.form.originalArt}
        orientationPreview={form.orientationPreview}
        offerFraming={form.form.offerFramingForOriginal}
        frames={form.form.frames}
        onCategoryChange={(val) => form.setField("category", val)}
        onOAChange={form.setOA}
        onFramingChange={(val) => form.setField("offerFramingForOriginal", val)}
        onUpdateFrame={form.updateFrame}
        onAddFrame={form.addFrame}
        onRemoveFrame={form.removeFrame}
      />

      {/* ── Prints ── */}
      <PrintsSection
        prints={form.form.prints}
        offerFraming={form.form.offerFramingForPrints}
        frames={form.form.frames}
        onUpdatePrint={form.updatePrint}
        onAddPrint={form.addPrint}
        onRemovePrint={form.removePrint}
        onAddSize={form.addSize}
        onRemoveSize={form.removeSize}
        onFramingChange={(val) => form.setField("offerFramingForPrints", val)}
        onUpdateFrame={form.updateFrame}
        onAddFrame={form.addFrame}
        onRemoveFrame={form.removeFrame}
      />

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={form.handleDiscard}
          className="px-5 py-2 text-sm rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 transition"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={form.handleSave}
          className="px-5 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
        >
          ✓ Save Artwork
        </button>
      </div>
    </div>
  );
}