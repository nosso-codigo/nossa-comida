package br.com.nosso.codigo.comida.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.runtime.annotations.RegisterForReflection;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cardapio.
 */
@Entity
@Table(name = "tb_cardapio")
@Cacheable
@RegisterForReflection
public class Cardapio extends PanacheEntityBase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "nome")
    public String nome;

    @OneToOne
    @JoinColumn(unique = true)
    public Restaurante restaurante;

    @OneToMany(mappedBy = "cardapio")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    public Set<Prato> pratoes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cardapio)) {
            return false;
        }
        return id != null && id.equals(((Cardapio) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Cardapio{" + "id=" + id + ", nome='" + nome + "'" + "}";
    }

    public Cardapio update() {
        return update(this);
    }

    public Cardapio persistOrUpdate() {
        return persistOrUpdate(this);
    }

    public static Cardapio update(Cardapio cardapio) {
        if (cardapio == null) {
            throw new IllegalArgumentException("cardapio can't be null");
        }
        var entity = Cardapio.<Cardapio>findById(cardapio.id);
        if (entity != null) {
            entity.nome = cardapio.nome;
            entity.restaurante = cardapio.restaurante;
            entity.pratoes = cardapio.pratoes;
        }
        return entity;
    }

    public static Cardapio persistOrUpdate(Cardapio cardapio) {
        if (cardapio == null) {
            throw new IllegalArgumentException("cardapio can't be null");
        }
        if (cardapio.id == null) {
            persist(cardapio);
            return cardapio;
        } else {
            return update(cardapio);
        }
    }
}
