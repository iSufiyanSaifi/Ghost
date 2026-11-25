import * as React from "react"
import { EyeIcon, PencilIcon, XCircleIcon } from "lucide-react"

import { StatusBadge, type StatusTone } from "@/components/ghost/status-badge"
import {
  DataTable,
  DataTableColumnVisibilityMenu,
  DataTableCommandBar,
  DataTableFilterMenu,
  DataTablePagination,
  DataTableSearch,
  DataTableSortingMenu,
  DataTableTable,
  DataTableToolbar,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  createDataTableFilterHelper,
  formatDataTableCurrency,
  formatDataTableDate,
  useDataTable,
  type DataTableDateComparisonOperator,
  type DataTableFilteringState,
  type DataTablePaginationState,
  type DataTableRowSelectionState,
  type DataTableSortingState,
  type VisibilityState,
} from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"

type Status = "In workshop" | "Awaiting approval" | "Quality check" | "Ready for delivery" | "Delivered" | "Cancelled"

const STATUS_TONE: Record<Status, StatusTone> = {
  "In workshop": "info",
  "Awaiting approval": "pending",
  "Quality check": "warning",
  "Ready for delivery": "success",
  Delivered: "neutral",
  Cancelled: "error",
}

type ServiceOrder = {
  id: string
  customer: string
  vehicle: string
  registration: string
  service: string
  status: Status
  amount: number
  createdAt: string
}

const CUSTOMERS = [
  "Aarav Mehta", "Priya Nair", "Rohan Kulkarni", "Ananya Iyer", "Vikram Singh", "Sneha Patil",
  "Arjun Reddy", "Kavya Menon", "Rahul Deshmukh", "Meera Joshi", "Aditya Rao", "Ishita Banerjee",
  "Karan Malhotra", "Pooja Shetty", "Siddharth Jain", "Neha Gupta", "Farhan Qureshi", "Lakshmi Krishnan",
  "Harpreet Kaur", "Nikhil Agarwal", "Divya Pillai", "Manish Tiwari", "Shreya Chatterjee", "Yusuf Khan",
  "Tanvi Bhatt", "Gaurav Saxena", "Ritika Sharma", "Abhishek Pandey", "Swati Kapoor", "Joseph Fernandes",
]
const VEHICLES = [
  "Maruti Swift", "Hyundai Creta", "Tata Nexon", "Mahindra XUV700", "Honda City", "Kia Seltos",
  "Toyota Innova Crysta", "Maruti Baleno", "Hyundai i20", "Tata Punch", "MG Hector", "Skoda Slavia",
]
const STATES = ["MH 12", "KA 03", "DL 8C", "TN 09", "GJ 01", "TS 07", "KL 07", "RJ 14", "UP 32", "WB 02"]
const SERVICES = [
  "General service", "Brake pad change", "AC gas refill", "Wheel alignment",
  "Clutch overhaul", "Battery replacement", "Denting and painting", "Engine diagnostics",
]
const STATUSES: Status[] = ["In workshop", "Awaiting approval", "Quality check", "Ready for delivery", "Delivered"]
const LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ"

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function makeOrders(): ServiceOrder[] {
  const today = startOfToday()
  return CUSTOMERS.map((customer, i) => {
    const created = new Date(today)
    created.setDate(today.getDate() - ((i * 7) % 45))
    created.setHours(9 + (i % 8), (i * 13) % 60)
    const series = `${LETTERS[(i * 5) % LETTERS.length]}${LETTERS[(i * 11 + 3) % LETTERS.length]}`
    return {
      id: `SO-2026-04${String(12 + i).padStart(2, "0")}`,
      customer,
      vehicle: VEHICLES[(i * 7) % VEHICLES.length],
      registration: `${STATES[i % STATES.length]} ${series} ${String(1000 + ((i * 2731) % 9000)).padStart(4, "0")}`,
      service: SERVICES[(i * 3) % SERVICES.length],
      status: STATUSES[(i * 2 + (i % 3)) % STATUSES.length],
      amount: 1800 + ((i * 7919) % 83000),
      createdAt: created.toISOString(),
    }
  })
}

const daysAgo = (n: number) => {
  const d = startOfToday()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const columnHelper = createDataTableColumnHelper<ServiceOrder>()
const filterHelper = createDataTableFilterHelper<ServiceOrder>()
const commandHelper = createDataTableCommandHelper()

const filters = [
  filterHelper.accessor("status", {
    type: "multiselect",
    label: "Status",
    searchable: false,
    options: (Object.keys(STATUS_TONE) as Status[]).map((s) => ({ label: s, value: s })),
  }),
  filterHelper.accessor("createdAt", {
    type: "date",
    label: "Created",
    options: [
      { label: "Today", value: { $gte: daysAgo(0) } },
      { label: "Last 7 days", value: { $gte: daysAgo(7) } },
      { label: "Last 30 days", value: { $gte: daysAgo(30) } },
    ],
  }),
]

function matchesDate(iso: string, range: DataTableDateComparisonOperator) {
  const t = new Date(iso).getTime()
  if (range.$gte && t < new Date(range.$gte).getTime()) return false
  if (range.$gt && t <= new Date(range.$gt).getTime()) return false
  if (range.$lte && t > new Date(range.$lte).getTime()) return false
  if (range.$lt && t >= new Date(range.$lt).getTime()) return false
  return true
}

export default function DataTableDemo() {
  const [orders, setOrders] = React.useState(makeOrders)
  const [search, setSearch] = React.useState("")
  const [filtering, setFiltering] = React.useState<DataTableFilteringState>({})
  const [sorting, setSorting] = React.useState<DataTableSortingState | null>({ id: "createdAt", desc: true })
  const [pagination, setPagination] = React.useState<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 })
  const [rowSelection, setRowSelection] = React.useState<DataTableRowSelectionState>({})
  const [visibility, setVisibility] = React.useState<VisibilityState>({})
  const [notice, setNotice] = React.useState("Click a row, or select rows and press R or D.")

  const columns = React.useMemo(
    () => [
      columnHelper.select(),
      columnHelper.accessor("id", {
        header: "Order",
        enableSorting: true,
        sortAscLabel: "Oldest first",
        sortDescLabel: "Newest first",
        cell: ({ getValue }) => <span className="font-medium tabular-nums">{getValue()}</span>,
      }),
      columnHelper.accessor("customer", { header: "Customer", enableSorting: true }),
      columnHelper.accessor("vehicle", {
        header: "Vehicle",
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span>{row.original.vehicle}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{row.original.registration}</span>
          </div>
        ),
      }),
      columnHelper.accessor("service", { header: "Service" }),
      columnHelper.accessor("status", {
        header: "Status",
        enableSorting: true,
        cell: ({ getValue }) => <StatusBadge tone={STATUS_TONE[getValue()]}>{getValue()}</StatusBadge>,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        align: "right",
        enableSorting: true,
        sortAscLabel: "Low to high",
        sortDescLabel: "High to low",
        cell: ({ getValue }) => <span className="tabular-nums">{formatDataTableCurrency(getValue())}</span>,
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        enableSorting: true,
        sortAscLabel: "Oldest first",
        sortDescLabel: "Newest first",
        cell: ({ getValue }) => <span className="tabular-nums">{formatDataTableDate(getValue())}</span>,
      }),
      columnHelper.action({
        actions: ({ row }) => [
          [
            { label: "View", icon: <EyeIcon />, onClick: () => setNotice(`Viewing ${row.original.id}`) },
            { label: "Edit", icon: <PencilIcon />, onClick: () => setNotice(`Editing ${row.original.id}`) },
          ],
          [
            {
              label: "Cancel order",
              icon: <XCircleIcon />,
              variant: "destructive",
              onClick: () => {
                setOrders((prev) => prev.map((o) => (o.id === row.original.id ? { ...o, status: "Cancelled" } : o)))
                setNotice(`${row.original.id} cancelled`)
              },
            },
          ],
        ],
      }),
    ],
    []
  )

  const commands = React.useMemo(
    () => [
      commandHelper.command({
        label: "Mark ready",
        shortcut: "r",
        action: (selection) => {
          const ids = Object.keys(selection).filter((id) => selection[id])
          setOrders((prev) => prev.map((o) => (ids.includes(o.id) ? { ...o, status: "Ready for delivery" } : o)))
          setRowSelection({})
          setNotice(`${ids.length} marked ready for delivery`)
        },
      }),
      commandHelper.command({
        label: "Delete",
        shortcut: "d",
        action: (selection) => {
          const ids = Object.keys(selection).filter((id) => selection[id])
          setOrders((prev) => prev.filter((o) => !ids.includes(o.id)))
          setRowSelection({})
          setNotice(`${ids.length} deleted`)
        },
      }),
    ],
    []
  )

  // The table is controlled: search, filter, sort and paginate here (or on your API).
  const processed = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    const statuses = filtering.status as Status[] | undefined
    const created = filtering.createdAt as DataTableDateComparisonOperator | undefined
    let rows = orders.filter(
      (o) =>
        (!q || [o.id, o.customer, o.vehicle, o.registration, o.service].some((v) => v.toLowerCase().includes(q))) &&
        (!statuses?.length || statuses.includes(o.status)) &&
        (!created || matchesDate(o.createdAt, created))
    )
    if (sorting) {
      const key = sorting.id as keyof ServiceOrder
      rows = [...rows].sort((a, b) => {
        const av = a[key]
        const bv = b[key]
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
        return sorting.desc ? -cmp : cmp
      })
    }
    return rows
  }, [orders, search, filtering, sorting])

  const { pageIndex, pageSize } = pagination
  const page = processed.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  // Keep the page in range after deleting rows.
  React.useEffect(() => {
    const last = Math.max(Math.ceil(processed.length / pageSize) - 1, 0)
    if (pageIndex > last) setPagination((p) => ({ ...p, pageIndex: last }))
  }, [processed.length, pageIndex, pageSize])

  const table = useDataTable({
    data: page,
    columns,
    getRowId: (row) => row.id,
    rowCount: processed.length,
    filters,
    commands,
    search: { state: search, onSearchChange: setSearch },
    filtering: { state: filtering, onFilteringChange: setFiltering },
    sorting: { state: sorting, onSortingChange: (s) => setSorting(s ?? null) },
    pagination: { state: pagination, onPaginationChange: setPagination },
    rowSelection: { state: rowSelection, onRowSelectionChange: setRowSelection },
    columnVisibility: { state: visibility, onColumnVisibilityChange: setVisibility },
    onRowClick: (_, row) => setNotice(`Opened ${row.id} · ${row.customer}`),
  })

  return (
    // The transform keeps the floating command bar inside the gallery tile.
    <div className="relative flex w-full min-w-[720px] transform-gpu flex-col gap-2 pb-20">
      <DataTable instance={table}>
        <DataTableToolbar className="justify-between">
          <Heading level="h3" className="whitespace-nowrap">
            Service orders
          </Heading>
          <div className="flex items-center gap-2">
            <DataTableSearch placeholder="Search orders" className="w-56" />
            <DataTableFilterMenu />
            <DataTableSortingMenu />
            <DataTableColumnVisibilityMenu />
          </div>
        </DataTableToolbar>
        <DataTableTable
          emptyState={{
            empty: { heading: "No service orders", description: "New orders from the front desk appear here." },
            filtered: { heading: "No matching orders", description: "Try another search or clear the filters." },
          }}
        />
        <DataTablePagination pageSizeOptions={[10, 20, 50]} />
        <DataTableCommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {notice}
      </p>
    </div>
  )
}
