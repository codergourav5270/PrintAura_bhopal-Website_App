import { AdminLayout } from '../../components/admin/AdminLayout.jsx'
import { PosterForm } from '../../components/admin/PosterForm.jsx'

export default function AdminAddProduct() {
  return (
    <AdminLayout title="Add poster">
      <PosterForm mode="add" />
    </AdminLayout>
  )
}
