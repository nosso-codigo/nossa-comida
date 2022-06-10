package br.com.nosso.codigo.comida.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.runtime.annotations.RegisterForReflection;
import java.io.Serializable;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Prato.
 */
@Entity
@Table(name = "tb_cardapio_prato")
@Cacheable
@RegisterForReflection
public class Prato extends PanacheEntityBase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "nome")
    public String nome;

    @ManyToOne
    @JoinColumn(name = "cardapio_id")
    @JsonbTransient
    public Cardapio cardapio;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prato)) {
            return false;
        }
        return id != null && id.equals(((Prato) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Prato{" + "id=" + id + ", nome='" + nome + "'" + "}";
    }

    public Prato update() {
        return update(this);
    }

    public Prato persistOrUpdate() {
        return persistOrUpdate(this);
    }

    public static Prato update(Prato prato) {
        if (prato == null) {
            throw new IllegalArgumentException("prato can't be null");
        }
        var entity = Prato.<Prato>findById(prato.id);
        if (entity != null) {
            entity.nome = prato.nome;
            entity.cardapio = prato.cardapio;
        }
        return entity;
    }

    public static Prato persistOrUpdate(Prato prato) {
        if (prato == null) {
            throw new IllegalArgumentException("prato can't be null");
        }
        if (prato.id == null) {
            persist(prato);
            return prato;
        } else {
            return update(prato);
        }
    }
}
