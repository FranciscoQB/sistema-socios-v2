// src/views/libro-caja/LibroCajaView.jsx
import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibroCaja } from '../../hooks/useLibroCaja';
import { useSocios } from '../../hooks/useSocios';
import { useProyectos } from '../../hooks/useProyectos';
import {
  Button,
  Table,
  Badge,
  Modal,
  ModalFooter,
  Input,
  Select,
  StatCard
} from '../../components/common';
import { PageHeader } from '../../components/layout';
import { formatCurrency, formatDate, getTodayDate, getMonthName } from '../../utils/formatters';
import { 
  TIPOS_MOVIMIENTO, 
  CATEGORIAS_INGRESO, 
  CATEGORIAS_EGRESO,
  METODOS_PAGO 
} from '../../utils/constants';

/**
 * Vista de Libro de Caja - Gestión de ingresos y egresos
 */
const LibroCajaView = () => {
  const { isAdmin, session } = useAuth();
  const { socios } = useSocios();
  const { proyectos } = useProyectos();
  const {
    filteredMovimientos,
    filterTipo,
    setFilterTipo,
    filterMes,
    setFilterMes,
    totalIngresos,
    totalEgresos,
    balance,
    mesesUnicos,
    saveMovimiento,
    deleteMovimiento
  } = useLibroCaja();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Abrir modal
  const openModal = (movimiento = null) => {
    setEditingItem(movimiento);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setEditingItem(null);
    setShowModal(false);
  };

  // Guardar movimiento
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const movimientoData = {
      id: editingItem ? editingItem.id : Date.now(),
      fecha: formData.get('fecha'),
      tipo: formData.get('tipo'),
      categoria: formData.get('categoria'),
      concepto: formData.get('concepto'),
      monto: parseFloat(formData.get('monto')),
      metodo_pago: formData.get('metodo_pago') || null,
      comprobante: formData.get('comprobante') || null,
      observaciones: formData.get('observaciones') || null,
      socio_id: formData.get('socio_id') ? parseInt(formData.get('socio_id')) : null,
      proyecto_id: formData.get('proyecto_id') ? parseInt(formData.get('proyecto_id')) : null,
      registrado_por: session?.user?.id
    };

    const { success } = await saveMovimiento(movimientoData, !!editingItem);
    if (success) {
      closeModal();
    }
  };

  // Eliminar movimiento
  const handleDelete = async (id) => {
    await deleteMovimiento(id);
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (fecha) => formatDate(fecha)
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (tipo) => (
        <Badge variant={tipo === 'ingreso' ? 'green' : 'red'}>
          {tipo === 'ingreso' ? '💰 Ingreso' : '💸 Egreso'}
        </Badge>
      )
    },
    { key: 'categoria', label: 'Categoría' },
    { key: 'concepto', label: 'Concepto' },
    {
      key: 'metodo_pago',
      label: 'Método',
      render: (metodo) => (
        metodo ? <Badge variant="gray">{metodo}</Badge> : 'N/A'
      )
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (monto, row) => (
        <span className={`font-bold ${row.tipo === 'egreso' ? 'text-red-600' : ''}`}>
          {row.tipo === 'ingreso' ? '+' : '-'} {formatCurrency(monto)}
        </span>
      )
    }
  ];

  // Agregar columna de acciones si es admin
  if (isAdmin) {
    columns.push({
      key: 'acciones',
      label: 'Acciones',
      render: (_, movimiento) => (
        <div className="flex gap-2">
          <Button
            variant="icon-edit"
            onClick={() => openModal(movimiento)}
            title="Editar"
          >
            <Edit2 size={18} />
          </Button>
          <Button
            variant="icon-delete"
            onClick={() => handleDelete(movimiento.id)}
            title="Eliminar"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )
    });
  }

  return (
    <div>
      <PageHeader
        title="Libro de Caja"
        actions={
          isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => openModal()}
            >
              Registrar Movimiento
            </Button>
          )
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Ingresos"
          value={formatCurrency(totalIngresos)}
          iconColor="green"
        />

        <StatCard
          label="Total Egresos"
          value={formatCurrency(totalEgresos)}
          iconColor="orange"
        />

        <StatCard
          label="Balance"
          value={formatCurrency(balance)}
          iconColor={balance >= 0 ? 'blue' : 'red'}
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Tipo"
              name="filterTipo"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: TIPOS_MOVIMIENTO.INGRESO, label: 'Ingresos' },
                { value: TIPOS_MOVIMIENTO.EGRESO, label: 'Egresos' }
              ]}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select
              label="Mes"
              name="filterMes"
              value={filterMes}
              onChange={(e) => setFilterMes(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos los meses' },
                ...mesesUnicos.map(mes => ({
                  value: mes,
                  label: `${getMonthName(parseInt(mes.split('-')[1]))} ${mes.split('-')[0]}`
                }))
              ]}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFilterTipo('todos');
                setFilterMes('todos');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table
          columns={columns}
          data={filteredMovimientos}
          emptyMessage="No hay movimientos registrados"
        />
      </div>

      {/* Modal de Movimiento */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingItem ? 'Editar Movimiento' : 'Registrar Movimiento'}
          size="large"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de movimiento"
                name="tipo"
                defaultValue={editingItem?.tipo || TIPOS_MOVIMIENTO.INGRESO}
                options={[
                  { value: TIPOS_MOVIMIENTO.INGRESO, label: '💰 Ingreso' },
                  { value: TIPOS_MOVIMIENTO.EGRESO, label: '💸 Egreso' }
                ]}
                required
              />

              <Input
                label="Fecha"
                name="fecha"
                type="date"
                defaultValue={editingItem?.fecha || getTodayDate()}
                required
              />

              <Select
                label="Categoría"
                name="categoria"
                defaultValue={editingItem?.categoria}
                required
              >
                <optgroup label="Ingresos">
                  {CATEGORIAS_INGRESO.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Egresos">
                  {CATEGORIAS_EGRESO.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </optgroup>
              </Select>

              <Input
                label="Concepto/Descripción"
                name="concepto"
                defaultValue={editingItem?.concepto}
                placeholder="Describe el movimiento"
                required
              />

              <Input
                label="Monto (S/)"
                name="monto"
                type="number"
                step="0.01"
                defaultValue={editingItem?.monto}
                placeholder="0.00"
                required
              />

              <Select
                label="Método de pago"
                name="metodo_pago"
                defaultValue={editingItem?.metodo_pago}
                placeholder="Seleccionar..."
                options={METODOS_PAGO}
              />

              <Select
                label="Relacionado con socio (opcional)"
                name="socio_id"
                defaultValue={editingItem?.socio_id}
                placeholder="Ninguno"
                options={socios.map(s => ({
                  value: s.id,
                  label: `${s.nombre} - ${s.lote}`
                }))}
              />

              <Select
                label="Relacionado con proyecto (opcional)"
                name="proyecto_id"
                defaultValue={editingItem?.proyecto_id}
                placeholder="Ninguno"
                options={proyectos.map(p => ({
                  value: p.id,
                  label: p.nombre
                }))}
              />

              <Input
                label="N° de comprobante (opcional)"
                name="comprobante"
                defaultValue={editingItem?.comprobante}
                placeholder="Ej: BOL-001, FAC-123"
              />

              <div className="md:col-span-2">
                <Input
                  label="Observaciones (opcional)"
                  name="observaciones"
                  defaultValue={editingItem?.observaciones}
                  placeholder="Notas adicionales"
                />
              </div>
            </div>

            <ModalFooter>
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LibroCajaView;