import { ExternalBlob, createActor } from "@/backend";
import type { Vehicle, VehicleInput } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminSetVehicleSortOrders,
  useGetVehicleSortOrders,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  Check,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM: VehicleFormData = {
  name: "",
  year: "2026",
  color: "",
  dailyRate: "",
  mileageLimit: "",
  deposit: "",
  description: "",
  rules: "",
  available: true,
  imageUrl: "",
};

interface VehicleFormData {
  name: string;
  year: string;
  color: string;
  dailyRate: string;
  mileageLimit: string;
  deposit: string;
  description: string;
  rules: string;
  available: boolean;
  imageUrl: string;
}

function VehicleModal({
  vehicle,
  onClose,
}: { vehicle: Vehicle | null; onClose: () => void }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [form, setForm] = useState<VehicleFormData>(
    vehicle
      ? {
          name: vehicle.name,
          year: vehicle.year.toString(),
          color: vehicle.color,
          dailyRate: Number(vehicle.dailyRate).toString(),
          mileageLimit: vehicle.mileageLimit.toString(),
          deposit: Number(vehicle.deposit).toString(),
          description: vehicle.description,
          rules: vehicle.rules.join("\n"),
          available: vehicle.available,
          imageUrl: vehicle.imageUrl,
        }
      : EMPTY_FORM,
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  function upd(k: keyof VehicleFormData, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    try {
      let finalImageUrl = form.imageUrl;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        const backend = actor as unknown as {
          _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>;
          _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>;
        };
        const reference = await backend._uploadFile(blob);
        const downloaded = await backend._downloadFile(reference);
        finalImageUrl = downloaded.getDirectURL();
      }
      const input: VehicleInput = {
        name: form.name,
        year: BigInt(form.year),
        color: form.color,
        dailyRate: BigInt(Math.round(Number.parseFloat(form.dailyRate))),
        mileageLimit: BigInt(form.mileageLimit),
        deposit: BigInt(Math.round(Number.parseFloat(form.deposit))),
        description: form.description,
        rules: form.rules.split("\n").filter(Boolean),
        available: form.available,
        imageUrl: finalImageUrl,
      };
      let result:
        | { __kind__: "ok"; ok: Vehicle }
        | { __kind__: "err"; err: string }
        | undefined;
      if (vehicle) {
        result = await actor.adminUpdateVehicle(vehicle.id, input);
      } else {
        result = await actor.adminAddVehicle(input);
      }
      if (result.__kind__ === "err") throw new Error(result.err);
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success(vehicle ? "Vehicle updated" : "Vehicle added");
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous object URL to avoid memory leaks
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    const preview = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreview(preview);
    upd("imageUrl", preview); // show preview in the form's image field immediately
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-bold">
            {vehicle ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="fleet.modal_close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => upd("name", e.target.value)}
                placeholder="Lamborghini Urus"
                data-ocid="fleet.vehicle_name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">Year</Label>
              <Input
                value={form.year}
                onChange={(e) => upd("year", e.target.value)}
                placeholder="2026"
                data-ocid="fleet.vehicle_year_input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">Color</Label>
              <Input
                value={form.color}
                onChange={(e) => upd("color", e.target.value)}
                placeholder="Pearl White"
                data-ocid="fleet.vehicle_color_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">
                Daily Rate ($)
              </Label>
              <Input
                type="number"
                min={0}
                max={1000000}
                step={1}
                value={form.dailyRate}
                onChange={(e) => upd("dailyRate", e.target.value)}
                placeholder="1200"
                data-ocid="fleet.vehicle_rate_input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">
                Mileage Limit/day
              </Label>
              <Input
                type="number"
                value={form.mileageLimit}
                onChange={(e) => upd("mileageLimit", e.target.value)}
                placeholder="200"
                data-ocid="fleet.vehicle_mileage_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">
                Deposit ($)
              </Label>
              <Input
                type="number"
                min={0}
                max={1000000}
                step={1}
                value={form.deposit}
                onChange={(e) => upd("deposit", e.target.value)}
                placeholder="5000"
                data-ocid="fleet.vehicle_deposit_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">
              Vehicle Photo
            </Label>
            {/* Gallery/file picker — no capture attribute so mobile shows file gallery */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Upload vehicle photo from gallery"
              onChange={handleFileSelect}
              data-ocid="fleet.vehicle_image_input"
            />
            {/* Camera input — capture forces camera on mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              aria-label="Take photo with camera"
              onChange={handleFileSelect}
            />
            {(photoPreview || form.imageUrl) && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border bg-secondary/30">
                <img
                  src={photoPreview || form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                {photoFile && (
                  <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                    New — saves on Submit
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 text-xs uppercase tracking-widest"
                data-ocid="fleet.upload_button"
              >
                <Upload className="w-4 h-4 mr-1.5" /> Upload Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                className="text-xs uppercase tracking-widest"
                data-ocid="fleet.camera_button"
                aria-label="Take photo with camera"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Or paste a URL:</p>
            <Input
              value={photoFile ? "" : form.imageUrl}
              onChange={(e) => {
                setPhotoFile(null);
                setPhotoPreview("");
                upd("imageUrl", e.target.value);
              }}
              placeholder="https://..."
              className="text-xs"
              data-ocid="fleet.vehicle_image_url_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) => upd("description", e.target.value)}
              rows={3}
              placeholder="Vehicle description..."
              data-ocid="fleet.vehicle_desc_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest">
              Rules (one per line)
            </Label>
            <Textarea
              value={form.rules}
              onChange={(e) => upd("rules", e.target.value)}
              rows={4}
              placeholder="Driver must be 25+..."
              data-ocid="fleet.vehicle_rules_input"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.available}
              onCheckedChange={(v) => upd("available", v)}
              data-ocid="fleet.vehicle_available_switch"
            />
            <Label className="text-sm">Available for booking</Label>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="fleet.modal_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="fleet.modal_save_button"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" /> Save Vehicle
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  vehicle,
  onClose,
}: { vehicle: Vehicle; onClose: () => void }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  async function handleDelete() {
    if (!actor) return;
    setDeleting(true);
    const result = await actor.adminDeleteVehicle(vehicle.id);
    if (result.__kind__ === "err") {
      toast.error(result.err);
      setDeleting(false);
      return;
    }
    qc.invalidateQueries({ queryKey: ["vehicles"] });
    toast.success("Vehicle removed");
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="font-display text-lg font-bold mb-2">Delete Vehicle?</h3>
        <p className="text-muted-foreground text-sm mb-6">
          This will permanently remove{" "}
          <strong className="text-foreground">{vehicle.name}</strong> from the
          fleet.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="fleet.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            data-ocid="fleet.delete_confirm_button"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FleetTab() {
  const { actor, isFetching } = useActor(createActor);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null | "new">(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const [sortList, setSortList] = useState<Vehicle[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVehicles();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: savedOrders = [] } = useGetVehicleSortOrders();
  const { mutateAsync: setSortOrders } = useAdminSetVehicleSortOrders();

  // Sync sortList when vehicles or savedOrders change
  useState(() => {
    if (vehicles.length === 0) return;
    if (savedOrders.length > 0) {
      const orderMap = new Map<string, number>(savedOrders);
      const sorted = [...vehicles].sort((a, b) => {
        const posA = orderMap.get(a.id.toString()) ?? 9999;
        const posB = orderMap.get(b.id.toString()) ?? 9999;
        return posA - posB;
      });
      setSortList(sorted);
    } else {
      setSortList([...vehicles]);
    }
  });

  // Keep sortList in sync when vehicles list changes externally
  const prevVehicleCount = sortList.length;
  if (vehicles.length !== prevVehicleCount && vehicles.length > 0) {
    if (savedOrders.length > 0) {
      const orderMap = new Map<string, number>(savedOrders);
      const sorted = [...vehicles].sort((a, b) => {
        const posA = orderMap.get(a.id.toString()) ?? 9999;
        const posB = orderMap.get(b.id.toString()) ?? 9999;
        return posA - posB;
      });
      setSortList(sorted);
    } else {
      setSortList([...vehicles]);
    }
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, overIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === overIndex) return;
    const next = [...sortList];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    setSortList(next);
    setDragIndex(overIndex);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  async function handleSaveOrder() {
    setSavingOrder(true);
    try {
      const orders: Array<[string, number]> = sortList.map((v, i) => [
        v.id.toString(),
        i,
      ]);
      await setSortOrders(orders);
      toast.success("Display order saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingOrder(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="fleet.loading_state">
        {["f1", "f2", "f3", "f4"].map((k) => (
          <Skeleton key={k} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" data-ocid="fleet.section">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setEditVehicle("new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs"
          data-ocid="fleet.add_vehicle_button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Vehicle
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Photo
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Vehicle
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Daily Rate
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr
                key={v.id.toString()}
                className={cn(
                  "border-b border-border last:border-0 transition-colors",
                  i % 2 === 0 ? "bg-card" : "bg-secondary/20",
                )}
                data-ocid={`fleet.item.${i + 1}`}
              >
                <td className="px-4 py-3">
                  <img
                    src={v.imageUrl}
                    alt={v.name}
                    className="w-14 h-10 object-cover rounded-md border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/placeholder.svg";
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{v.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.year.toString()} · {v.color}
                  </p>
                </td>
                <td className="px-4 py-3 text-foreground">
                  ${Number(v.dailyRate).toLocaleString()}/day
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      v.available
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {v.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditVehicle(v)}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Edit"
                      data-ocid={`fleet.edit_button.${i + 1}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteVehicle(v)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete"
                      data-ocid={`fleet.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="fleet.empty_state"
          >
            No vehicles in fleet. Add one to get started.
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {vehicles.map((v, i) => (
          <div
            key={v.id.toString()}
            className="bg-card border border-border rounded-xl p-4 flex gap-3"
            data-ocid={`fleet.item.${i + 1}`}
          >
            <img
              src={v.imageUrl}
              alt={v.name}
              className="w-16 h-14 object-cover rounded-lg border border-border shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{v.name}</p>
              <p className="text-xs text-muted-foreground">
                {v.year.toString()} · {v.color}
              </p>
              <p className="text-sm text-primary font-medium mt-1">
                ${Number(v.dailyRate).toLocaleString()}/day
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditVehicle(v)}
                className="p-1.5 text-muted-foreground hover:text-primary"
                aria-label="Edit"
                data-ocid={`fleet.mobile_edit_button.${i + 1}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteVehicle(v)}
                className="p-1.5 text-muted-foreground hover:text-destructive"
                aria-label="Delete"
                data-ocid={`fleet.mobile_delete_button.${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div
            className="py-12 text-center text-muted-foreground text-sm"
            data-ocid="fleet.empty_state"
          >
            No vehicles. Add one to get started.
          </div>
        )}
      </div>

      {/* ── Fleet Display Order ───────────────────────────────────────────── */}
      {vehicles.length > 0 && (
        <div
          className="bg-card border border-border rounded-xl overflow-hidden"
          data-ocid="fleet.sort_section"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-widest">
                Fleet Display Order
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Drag to change the order vehicles appear in the Featured Fleet
                section on the homepage.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs shrink-0"
              data-ocid="fleet.save_order_button"
            >
              {savingOrder ? "Saving..." : "Save Order"}
            </Button>
          </div>

          <div className="p-4 space-y-2" data-ocid="fleet.sort_list">
            {sortList.map((v, i) => (
              <div
                key={v.id.toString()}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-3 bg-background border border-border rounded-lg px-4 py-3 cursor-grab active:cursor-grabbing select-none transition-colors",
                  dragIndex === i
                    ? "border-primary/60 bg-primary/5"
                    : "hover:border-border/80",
                )}
                data-ocid={`fleet.sort_item.${i + 1}`}
              >
                <span className="text-muted-foreground/60 text-xs font-mono w-5 text-center shrink-0">
                  {i + 1}
                </span>
                <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  className="w-10 h-7 object-cover rounded border border-border shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <span className="text-sm font-medium text-foreground truncate min-w-0">
                  {v.name}
                </span>
                <span className="ml-auto text-xs text-muted-foreground shrink-0">
                  {v.year.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {editVehicle !== null && (
        <VehicleModal
          vehicle={editVehicle === "new" ? null : editVehicle}
          onClose={() => setEditVehicle(null)}
        />
      )}
      {deleteVehicle && (
        <DeleteConfirm
          vehicle={deleteVehicle}
          onClose={() => setDeleteVehicle(null)}
        />
      )}
    </div>
  );
}
