import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, publicApi } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ChevronLeft, ChevronRight, Pencil, Phone, Plus, Save, Search, Trash2, X } from 'lucide-react';

type YouthContact = {
  _id: string;
  name: string;
  contacts: string;
};

export default function YouthContactsDirectory() {
  const pageSize = 8;
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', contacts: '' });
  const [page, setPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: youthContacts = [], isLoading } = useQuery<YouthContact[]>({
    queryKey: ['youthContacts'],
    queryFn: () => publicApi.get('/youth-contacts').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; contacts: string }) => adminApi.post('/youth-contacts', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youthContacts'] });
      setForm({ name: '', contacts: '' });
      setSuccessMessage('Youth contact added successfully.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; name: string; contacts: string }) =>
      adminApi.put(`/youth-contacts/${payload.id}`, { name: payload.name, contacts: payload.contacts }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youthContacts'] });
      setEditingId(null);
      setForm({ name: '', contacts: '' });
      setSuccessMessage('Youth contact updated successfully.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/youth-contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['youthContacts'] });
      setSuccessMessage('Youth contact deleted successfully.');
    },
  });

  const filteredContacts = useMemo(
    () => youthContacts.filter((row) => row.name.toLowerCase().includes(search.toLowerCase())),
    [search, youthContacts]
  );

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const paginatedContacts = useMemo(
    () => filteredContacts.slice((page - 1) * pageSize, page * pageSize),
    [filteredContacts, page]
  );

  useEffect(() => {
    setPage(1);
  }, [search, youthContacts.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(''), 2500);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', contacts: '' });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      contacts: form.contacts.trim(),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const handleDelete = (row: YouthContact) => {
    const confirmed = window.confirm(`Delete ${row.name} from MMPalli youth contacts?`);
    if (!confirmed) return;
    deleteMutation.mutate(row._id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="section-card flex min-h-[580px] flex-col overflow-hidden">
      <div className="border-b border-[color:var(--line)] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-xl">
            <p className="muted-label">MMPalli youth</p>
            {/* <h2 className="section-title mt-2">Youth contacts directory</h2> */}
            {/* <p className="mt-3 text-sm leading-7 text-slate-600">
              Search by name and quickly find contact information. Admin can add, edit, and delete rows.
            </p> */}
          </div>

          <label className="relative block w-full xl:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search youth name"
              className="field-input pl-11"
            />
          </label>
        </div>
      </div>

      {successMessage ? (
        <div className="border-b border-[color:var(--line)] bg-emerald-50/90 px-6 py-3 text-sm font-medium text-emerald-700 sm:px-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        </div>
      ) : null}

      {isAdmin && (
        <div className="border-b border-[color:var(--line)] bg-stone-50/60 px-6 py-5 sm:px-8">
          <div className="grid gap-3 lg:grid-cols-[1.1fr_1.3fr_auto_auto]">
            <input
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              placeholder="Youth name"
              className="field-input"
            />
            <input
              value={form.contacts}
              onChange={(e) => setForm((current) => ({ ...current, contacts: e.target.value }))}
              placeholder="Phone numbers or note"
              className="field-input"
            />
            <button onClick={handleSave} disabled={isSaving || !form.name.trim()} className="btn-primary whitespace-nowrap">
              {editingId ? <Save size={16} /> : <Plus size={16} />}
              {editingId ? 'Update' : 'Add'}
            </button>
            <button onClick={resetForm} className="btn-ghost whitespace-nowrap">
              <X size={16} /> Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0 flex-col px-4 pb-4 pt-4 sm:px-6">
        <div className="hidden min-h-0 flex-1 overflow-hidden rounded-[1.4rem] border border-[color:var(--line)] bg-white/70 lg:block">
          <div className="h-full overflow-auto">
            <table className="min-w-full text-left">
              <thead className="sticky top-0 bg-stone-100/95 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Contact information</th>
                  {isAdmin ? <th className="px-5 py-4 text-right">Actions</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 bg-white/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={isAdmin ? 3 : 2} className="px-5 py-12 text-center text-slate-500">Loading youth contacts...</td>
                  </tr>
                ) : paginatedContacts.length ? (
                  paginatedContacts.map((row) => (
                    <tr key={row._id} className="hover:bg-stone-50/80">
                      <td className="px-5 py-4 font-semibold text-slate-800">{row.name}</td>
                      <td className="px-5 py-4 text-sm leading-7 text-slate-600">{row.contacts || 'Not added yet'}</td>
                      {isAdmin ? (
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingId(row._id);
                                setForm({ name: row.name, contacts: row.contacts });
                              }}
                              className="btn-ghost h-10 w-10 rounded-full px-0"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(row)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 3 : 2} className="px-5 py-12 text-center text-slate-500">No youth contact matches "{search}".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-3 lg:hidden">
          {isLoading ? (
            <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/70 p-6 text-center text-slate-500">Loading youth contacts...</div>
          ) : paginatedContacts.length ? (
            paginatedContacts.map((row) => (
              <div key={row._id} className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/75 p-5 shadow-[0_10px_24px_rgba(25,20,16,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{row.name}</p>
                    <div className="mt-3 flex items-start gap-2 text-sm leading-7 text-slate-600">
                      <Phone size={15} className="mt-1 shrink-0 text-[color:var(--brand-deep)]" />
                      <span>{row.contacts || 'Not added yet'}</span>
                    </div>
                  </div>
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(row._id);
                          setForm({ name: row.name, contacts: row.contacts });
                        }}
                        className="btn-ghost h-10 w-10 rounded-full px-0"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/70 p-6 text-center text-slate-500">No youth contact matches "{search}".</div>
          )}
        </div>

        {!isLoading && filteredContacts.length > 0 ? (
          <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-[color:var(--line)] px-1 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredContacts.length)} of {filteredContacts.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="btn-ghost h-10 w-10 rounded-full px-0 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-20 text-center font-medium text-slate-600">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="btn-ghost h-10 w-10 rounded-full px-0 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
